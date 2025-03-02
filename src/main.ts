import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(withInterceptors([authInterceptor])) // Provide the interceptor
//   ]
// }, appConfig)
//   .catch((err) => console.error(err));
const token = localStorage.getItem('access_token');

// Remove the token if it's invalid (not in JWT format)
if (!token || token.split('.').length !== 3) {
  localStorage.removeItem('access_token');
}

bootstrapApplication(AppComponent, {
  ...appConfig, // Merge appConfig here
  providers: [
    ...appConfig.providers, // Keep existing providers from appConfig
    provideHttpClient(withInterceptors([authInterceptor])) // Add interceptor
  ]
}).catch((err) => console.error(err));


