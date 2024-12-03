import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomPipe } from '../custom.pipe';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomPipe],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  productForm: FormGroup;
  products: { name: string; category: string; quantity: number }[] = [];
  showSuccessAlert = false;
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      this.products.push(this.productForm.value);
      this.showAlert('เพิ่มสินค้าสำเร็จ');
      this.productForm.reset({quantity: 1});
    }
  }

  updateQuantity(index: number, value: number) {
    const newQuantity = this.products[index].quantity + value;
    if (newQuantity >= 0) {
      this.products[index].quantity = newQuantity;
      this.showAlert(value > 0 ? 'เพิ่มจำนวนสำเร็จ' : 'ลดจำนวนสำเร็จ');
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

  // Validator helpers
  hasError(controlName: string, errorType: string): boolean {
    const control = this.productForm.get(controlName);
    return control?.errors?.[errorType] && control.touched;
  }
}