import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginatorIntl(currentLang: string) {
  const paginatorIntl = new MatPaginatorIntl();

  // Translation map
  const translations = {
    en: 'Items per page:',
    mk: 'Ставки по страница:',
    sr: 'Stavke po stranici:',
    al: 'Artikuj për faqe:'
  };

  paginatorIntl.nextPageLabel = 'Next page';
  paginatorIntl.previousPageLabel = 'Previous page';
  paginatorIntl.firstPageLabel = 'First page';
  paginatorIntl.lastPageLabel = 'Last page';

  return paginatorIntl;
}
