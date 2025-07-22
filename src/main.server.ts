import { bootstrapApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export default bootstrapApplication(AppComponent, appConfig); 