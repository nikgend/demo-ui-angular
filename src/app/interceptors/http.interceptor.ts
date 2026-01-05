import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// You can modify the request here if needed
		return next.handle(req);
	}
}
