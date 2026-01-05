import { TestBed } from '@angular/core/testing';
import { CommonFundSelectionService } from './common-fund-selection.service';

describe('CommonFundSelectionService', () => {
	let service: CommonFundSelectionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CommonFundSelectionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
