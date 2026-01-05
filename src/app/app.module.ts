import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ScopingModule } from './features/scoping/scoping.module';
import { HttpInterceptorService } from './interceptors/http-interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    ScopingModule
  ],
  providers: [
    { provide: 'HTTP_INTERCEPTORS', 
      useClass: HttpInterceptorService, 
      multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }