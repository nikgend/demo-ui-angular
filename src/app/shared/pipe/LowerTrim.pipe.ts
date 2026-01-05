import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowerTrim'
})
export class LowerTrimPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim().toLowerCase();
  }
}
