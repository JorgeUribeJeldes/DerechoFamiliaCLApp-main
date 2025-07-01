import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptosPage } from './conceptos.page';

describe('ConceptosPage', () => {
  let component: ConceptosPage;
  let fixture: ComponentFixture<ConceptosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
