import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // เพิ่ม import
import { CustomPipe } from '../custom.pipe';
import * as bootstrap from 'bootstrap';
import { Chart } from 'chart.js/auto';

export interface Product {
  name: string;
  category: string;
  quantity: number;
  minQuantity?: number;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated?: Date;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule, // เพิ่ม FormsModule
    CustomPipe
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  productForm: FormGroup;
  products: Product[] = [];
  showSuccessAlert = false;
  successMessage = '';
  editIndex: number | null = null;
  editModal: any;
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  chartInstance: any;
  sortOption: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = 'name';

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      if (this.editIndex !== null) {
        this.products[this.editIndex] = this.productForm.value;
        this.showAlert('แก้ไขสินค้าสำเร็จ');
        this.editIndex = null;
      } else {
        this.products.push(this.productForm.value);
        this.showAlert('เพิ่มสินค้าสำเร็จ');
      }
      this.productForm.reset({quantity: 1});
      this.updateCategories();
    }
  }

  editProduct(index: number) {
    this.editIndex = index;
    const product = this.products[index];
    this.productForm.setValue({
      name: product.name,
      category: product.category,
      quantity: product.quantity
    });
    
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      this.editModal = new bootstrap.Modal(modalElement);
      this.editModal.show();
    }
  }

  saveEdit() {
    if (this.productForm.valid && this.editIndex !== null) {
      this.products[this.editIndex] = this.productForm.value;
      this.showAlert('แก้ไขสินค้าสำเร็จ');
      this.closeEditModal();
      this.editIndex = null;
      this.productForm.reset({quantity: 1});
      this.updateCategories();
    }
  }

  closeEditModal() {
    this.editModal?.hide();
    this.editIndex = null;
    this.productForm.reset({quantity: 1});
  }

  updateQuantity(index: number, value: number) {
    const newQuantity = this.products[index].quantity + value;
    if (newQuantity >= 0) {
      this.products[index].quantity = newQuantity;
      this.showAlert(value > 0 ? 'เพิ่มจำนวนสำเร็จ' : 'ลดจำนวนสำเร็จ');
      this.updateProductStatus(this.products[index]);
    }
  }

  confirmDelete(index: number) {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${this.products[index].name}"?`)) {
      this.deleteProduct(index);
    }
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.showAlert('ลบสินค้าสำเร็จ');
    this.updateCategories();
  }

  getTotalQuantity(): number {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }

  private showAlert(message: string) {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.productForm.get(controlName);
    return control?.errors?.[errorType] && control.touched;
  }

  // Filter products
  get filteredProducts() {
    return this.products.filter(product => {
      const matchSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      return matchSearch && matchCategory;
    });
  }

  // Get unique categories
  updateCategories() {
    this.categories = [...new Set(this.products.map(p => p.category))];
  }

  // Get low stock products
  getLowStockProducts() {
    return this.products.filter(p => p.quantity <= (p.minQuantity || 5));
  }

  // Sort products

  get sortedProducts() {
    return [...this.products].sort((a, b) => {
      const multiplier = this.sortDirection === 'asc' ? 1 : -1;
      
      if (this.sortField === 'name') {
        return multiplier * a.name.localeCompare(b.name);
      } else if (this.sortField === 'quantity') {
        return multiplier * (a.quantity - b.quantity);
      }
      return 0;
    });
  }

  sortProducts(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  // Initialize chart
  initChart() {
    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.categories,
        datasets: [{
          label: 'จำนวนสินค้าแต่ละหมวดหมู่',
          data: this.categories.map(cat => 
            this.products.filter(p => p.category === cat)
              .reduce((sum, p) => sum + p.quantity, 0)
          ),
          backgroundColor: 'rgba(13,110,253,0.5)',
          borderColor: 'rgb(13,110,253)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'สถิติสินค้าตามหมวดหมู่' }
        }
      }
    });
  }

  // Update product status
  updateProductStatus(product: Product) {
    if (product.quantity === 0) {
      product.status = 'out_of_stock';
    } else if (product.quantity <= (product.minQuantity || 5)) {
      product.status = 'low_stock';
    } else {
      product.status = 'in_stock';
    }
    product.lastUpdated = new Date();
  }
}