import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../core/supabase.service';
export const adminAuthGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    supabase.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.navigate(['/admin/login']);
        resolve(false);
        return;
      }
      supabase.isAdmin().then(isAdmin => {
        if (!isAdmin) {
          router.navigate(['/admin/login']);
          resolve(false);
          return;
        }
        resolve(true);
      });
    }).catch(() => {
      router.navigate(['/admin/login']);
      resolve(false);
    });
  });
};
