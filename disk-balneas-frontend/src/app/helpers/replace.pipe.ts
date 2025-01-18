import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'replace',
  standalone: true,
})
export class ReplacePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, from: string, to: string): SafeHtml {
    if (!value) return value;
    
    const replaced = value.replace(new RegExp(from, 'g'), to);
    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  }

}
