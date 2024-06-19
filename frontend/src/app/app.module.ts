import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '@app/components/header/header.component';
import { FooterComponent } from '@app/components/footer/footer.component';
import { CartComponent } from '@app/components/cart/cart.component';
import { CheckoutComponent } from '@app/components/checkout/checkout.component';
import { HomeComponent } from '@app/components/home/home.component';
import { SearchproductComponent } from './components/searchproduct/searchproduct.component';
import { ProductComponent } from '@app/components/product/product.component';
import { ThankyouComponent } from '@app/components/thankyou/thankyou.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '@app/components/login/login.component';
import { ProfileComponent } from '@app/components/profile/profile.component';
import { SocialAuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { RegisterComponent } from '@app/components/register/register.component';
import { HomeLayoutComponent } from '@app/components/home-layout/home-layout.component';
import { AdminComponent } from './components/admin/admin.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CheckoutComponent,
    HomeComponent,
    SearchproductComponent,
    ProductComponent,
    ThankyouComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    HomeLayoutComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('1081819459547-39v24veen5tfk6t5t0k294ce65a8kq4h.apps.googleusercontent.com')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
      
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}