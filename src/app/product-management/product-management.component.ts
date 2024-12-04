// src/app/product-management/product-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CustomPipe } from '../custom.pipe';
import * as bootstrap from 'bootstrap';
import { Chart } from 'chart.js/auto';
import { ProductService } from '../services/product.service';
import { ErpIntegrationService } from '../services/erp-integration.service';

export interface Product {
  _id?: string;
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
    FormsModule,
    CustomPipe
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private erpIntegrationService: ErpIntegrationService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.updateCategories();
        this.initChart();
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;
      this.productService.addProduct(newProduct).subscribe({
        next: (product) => {
          this.products.push(product);
          this.showAlert('เพิ่มสินค้าสำเร็จ');
          this.productForm.reset({quantity: 1});
          this.updateCategories();
          this.initChart();
          this.erpIntegrationService.syncProductData(product).subscribe();
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.showAlert('เกิดข้อผิดพลาดในการเพิ่มสินค้า', 'danger');
        }
      });
    }
  }

  saveEdit() {
    if (this.productForm.valid && this.editIndex !== null) {
      const product = this.products[this.editIndex];
      this.productService.updateProduct(product._id!, this.productForm.value).subscribe({
        next: (updatedProduct) => {
          this.products[this.editIndex!] = updatedProduct;
          this.showAlert('แก้ไขสินค้าส���เร็จ');
          this.closeEditModal();
          this.editIndex = null;
          this.updateCategories();
          this.initChart();
          this.erpIntegrationService.syncProductData(updatedProduct).subscribe();
        },
        error: (error) => console.error('Error updating product:', error)
      });
    }
  }

  deleteProduct(index: number) {
    const product = this.products[index];
    this.productService.deleteProduct(product._id!).subscribe({
      next: () => {
        this.products.splice(index, 1);
        this.showAlert('ลบสินค้าสำเร็จ');
        this.updateCategories();
        this.initChart();
        this.erpIntegrationService.syncProductData({ _id: product._id, action: 'delete' }).subscribe();
      },
      error: (error) => console.error('Error deleting product:', error)
    });
  }

  updateQuantity(index: number, value: number) {
    const product = this.products[index];
    product.quantity += value;
    this.productService.updateProduct(product._id!, product).subscribe({
      next: (updatedProduct) => {
        this.products[index] = updatedProduct;
        this.updateCategories();
        this.initChart();
        this.erpIntegrationService.syncProductData(updatedProduct).subscribe();
      },
      error: (error) => console.error('Error updating quantity:', error)
    });
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

  confirmDelete(index: number) {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${this.products[index].name}"?`)) {
      this.deleteProduct(index);
    }
  }

  closeEditModal() {
    this.editModal?.hide();
    this.editIndex = null;
    this.productForm.reset({quantity: 1});
  }

  private showAlert(message: string, type: string = 'success') {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => this.showSuccessAlert = false, 3000);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.productForm.get(controlName);
    return control?.errors?.[errorType] && control.touched;
  }

  updateCategories() {
    this.categories = [...new Set(this.products.map(p => p.category))];
  }

  getLowStockProducts() {
    return this.products.filter(p => p.quantity <= (p.minQuantity || 5));
  }

  sortProducts(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

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

  getTotalQuantity(): number {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }
}