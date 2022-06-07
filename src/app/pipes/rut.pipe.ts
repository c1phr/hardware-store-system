import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rut'
})
export class RutPipe implements PipeTransform {

  transform(value: string): string {
    var result = '';
    if(value) {
      var aux = value;
      value = aux.replace(/\./g,'').replace(/\-/g,'');
      if((value.length - 1) > 0) {
        result = value.substring(0, value.length-1) + '-' + value[value.length-1]
        if((result.length - 5) > 0) {
          result = result.substring(0, value.length-4) + '.' + result.substring(result.length-5, result.length)
          if((result.length - 9) > 0) {
            result = result.substring(0, value.length-7) + '.' + result.substring(result.length-9, result.length)
            return result;
          }
          else {
            return result;
          }
        }
        else {
          return result;
        }
      }
      else {
        return value;
      }
    }
    else{
      return '';
    }
  }

}
