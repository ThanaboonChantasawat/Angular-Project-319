import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
  standalone: true  // เพิ่ม standalone
})
export class CustomPipe implements PipeTransform {
  transform(value: string, format: string = 'upper'): string {
    if (!value) return '';
    
    switch (format) {
      case 'upper':
        return value.toUpperCase();
      case 'lower':
        return value.toLowerCase();
      case 'title':
        return value.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      default:
        return value;
    }
  }
}