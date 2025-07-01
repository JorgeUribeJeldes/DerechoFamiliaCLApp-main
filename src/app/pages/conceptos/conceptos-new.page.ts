import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonMenuButton,
  IonButtons,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonChip,
  IonText,
  IonFab,
  IonFabButton,
  AlertController,
  ToastController,
  ModalController
} from '@ionic/angular/standalone';

import { AuthService, User } from '../../services/auth.service';

interface LegalConcept {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'matrimonio' | 'filiacion' | 'alimentos' | 'regimenes' | 'divorcio' | 'adopcion';
  articleRef: string;
  lastUpdated: string;
  keywords: string[];
}

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.page.html',
  styleUrls: ['./conceptos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonMenuButton,
    IonButtons,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonBadge,
    IonChip,
    IonText,
    IonFab,
    IonFabButton
  ]
})
export class ConceptosPage implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedCategory: string = 'todos';
  showSearch: boolean = false;
  isAdmin: boolean = false;
  filteredConcepts: LegalConcept[] = [];
  
  private userSubscription?: Subscription;

  // Base de datos de conceptos del Derecho de Familia Chileno
  private legalConcepts: LegalConcept[] = [
    {
      id: '1',
      title: 'Matrimonio',
      description: 'Contrato solemne por el cual un hombre y una mujer se unen actual e indisolublemente.',
      content: 'El matrimonio es un contrato solemne por el cual un hombre y una mujer se unen actual e indisolublemente, y por toda la vida, con el fin de vivir juntos, de procrear, y de auxiliarse mutuamente. Requiere para su validez el libre y pleno consentimiento de los contrayentes expresado ante el oficial del Registro Civil competente.',
      category: 'matrimonio',
      articleRef: 'Art. 102 Código Civil',
      lastUpdated: '2024-01-15',
      keywords: ['matrimonio', 'contrato', 'solemne', 'registro civil', 'consentimiento']
    },
    {
      id: '2',
      title: 'Divorcio',
      description: 'Disolución del vínculo matrimonial decretada por sentencia judicial.',
      content: 'El divorcio es la disolución del matrimonio válido, viviendo ambos esposos. Puede ser por mutuo acuerdo o por culpa de uno de los cónyuges. Las causales de divorcio están establecidas en la Ley de Matrimonio Civil.',
      category: 'divorcio',
      articleRef: 'Ley 19.947 Art. 54',
      lastUpdated: '2024-01-10',
      keywords: ['divorcio', 'disolución', 'matrimonio', 'mutuo acuerdo', 'culpa']
    },
    {
      id: '3',
      title: 'Patria Potestad',
      description: 'Conjunto de derechos y deberes que corresponden al padre o a la madre sobre los bienes de sus hijos no emancipados.',
      content: 'La patria potestad es el conjunto de derechos y deberes que corresponden al padre o a la madre sobre los bienes de sus hijos no emancipados. Se ejerce conjuntamente por ambos padres o por uno de ellos si el otro ha fallecido, está ausente o se encuentra privado de la patria potestad.',
      category: 'filiacion',
      articleRef: 'Art. 243 Código Civil',
      lastUpdated: '2024-01-12',
      keywords: ['patria potestad', 'derechos', 'deberes', 'padres', 'hijos', 'bienes']
    },
    {
      id: '4',
      title: 'Pensión Alimenticia',
      description: 'Obligación de proporcionar alimentos necesarios para la subsistencia del alimentario.',
      content: 'Se deben alimentos al cónyuge, a los descendientes, a los ascendientes, a los hermanos, y al que hizo una donación cuantiosa, si no hubiere sido rescindida o revocada. Los alimentos comprenden la obligación de proporcionar al alimentario menor de veintiún años la enseñanza básica y media.',
      category: 'alimentos',
      articleRef: 'Art. 321 Código Civil',
      lastUpdated: '2024-01-08',
      keywords: ['alimentos', 'pensión', 'subsistencia', 'cónyuge', 'hijos', 'ascendientes']
    },
    {
      id: '5',
      title: 'Sociedad Conyugal',
      description: 'Régimen patrimonial matrimonial legal y supletorio en Chile.',
      content: 'La sociedad conyugal se forma entre los cónyuges por el hecho del matrimonio, a menos que se haya pactado separación de bienes. En este régimen, el marido es jefe de la sociedad conyugal y administra tanto los bienes sociales como los de la mujer.',
      category: 'regimenes',
      articleRef: 'Art. 1718 Código Civil',
      lastUpdated: '2024-01-05',
      keywords: ['sociedad conyugal', 'régimen patrimonial', 'bienes', 'administración', 'cónyuges']
    },
    {
      id: '6',
      title: 'Separación de Bienes',
      description: 'Régimen patrimonial donde cada cónyuge conserva la propiedad y administración de sus bienes.',
      content: 'En el régimen de separación de bienes cada uno de los cónyuges conserva la propiedad, goce y libre administración de sus bienes presentes y futuros. Puede pactarse antes del matrimonio mediante capitulaciones matrimoniales.',
      category: 'regimenes',
      articleRef: 'Art. 158 Código Civil',
      lastUpdated: '2024-01-03',
      keywords: ['separación de bienes', 'régimen patrimonial', 'capitulaciones', 'administración']
    },
    {
      id: '7',
      title: 'Adopción',
      description: 'Institución jurídica que crea entre dos personas un vínculo de filiación.',
      content: 'La adopción confiere al adoptado el estado civil de hijo del o los adoptantes, con todos los derechos y deberes recíprocos establecidos en la ley. Es irrevocable y puede ser simple o plena según las circunstancias.',
      category: 'adopcion',
      articleRef: 'Ley 19.620',
      lastUpdated: '2024-01-01',
      keywords: ['adopción', 'filiación', 'hijo', 'adoptante', 'irrevocable', 'plena', 'simple']
    },
    {
      id: '8',
      title: 'Filiación',
      description: 'Relación de parentesco entre padres e hijos.',
      content: 'La filiación puede ser matrimonial o no matrimonial. Los hijos tienen iguales derechos y deberes respecto de sus padres, cualquiera sea la naturaleza de su filiación. Se determina por el nacimiento, por reconocimiento o por sentencia judicial.',
      category: 'filiacion',
      articleRef: 'Art. 179 Código Civil',
      lastUpdated: '2023-12-28',
      keywords: ['filiación', 'parentesco', 'matrimonial', 'reconocimiento', 'igualdad']
    },
    {
      id: '9',
      title: 'Cuidado Personal',
      description: 'Derecho-deber de los padres de tener consigo a sus hijos y cuidar de su crianza y educación.',
      content: 'El cuidado personal de los hijos corresponde al padre y a la madre conjuntamente, o a uno de ellos en subsidio del otro. En caso de separación de los padres, podrán acordar que el cuidado personal de uno o más hijos corresponda al padre, a la madre o a ambos en forma compartida.',
      category: 'filiacion',
      articleRef: 'Art. 224 Código Civil',
      lastUpdated: '2023-12-25',
      keywords: ['cuidado personal', 'crianza', 'educación', 'compartido', 'acuerdo']
    },
    {
      id: '10',
      title: 'Compensación Económica',
      description: 'Derecho del cónyuge más débil económicamente al término del matrimonio.',
      content: 'Si, como consecuencia de haberse dedicado al cuidado de los hijos o a las labores propias del hogar común, uno de los cónyuges no pudo desarrollar una actividad remunerada o lucrativa, o lo hizo en menor medida de lo que podía y quería, tendrá derecho a que, cuando se produzca el divorcio o se declare la nulidad del matrimonio, se le compense el menoscabo económico sufrido.',
      category: 'divorcio',
      articleRef: 'Art. 61 Ley 19.947',
      lastUpdated: '2023-12-20',
      keywords: ['compensación económica', 'menoscabo', 'cuidado hijos', 'hogar', 'actividad remunerada']
    }
  ];

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.filteredConcepts = [...this.legalConcepts];
    this.subscribeToUser();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private subscribeToUser() {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  toggleSearchMode() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
      this.filterConcepts({ target: { value: '' } });
    }
  }

  filterConcepts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;

    if (!query.trim()) {
      this.filteredConcepts = this.getCategoryFilteredConcepts();
      return;
    }

    this.filteredConcepts = this.legalConcepts.filter(concept =>
      concept.title.toLowerCase().includes(query) ||
      concept.description.toLowerCase().includes(query) ||
      concept.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      concept.articleRef.toLowerCase().includes(query)
    );
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.filteredConcepts = this.getCategoryFilteredConcepts();
  }

  private getCategoryFilteredConcepts(): LegalConcept[] {
    if (this.selectedCategory === 'todos') {
      return [...this.legalConcepts];
    }
    return this.legalConcepts.filter(concept => concept.category === this.selectedCategory);
  }

  getDisplayConcepts(): LegalConcept[] {
    return this.filteredConcepts;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'matrimonio': 'heart',
      'divorcio': 'heart-dislike',
      'filiacion': 'people',
      'alimentos': 'card',
      'regimenes': 'business',
      'adopcion': 'home'
    };
    return icons[category] || 'document-text';
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'matrimonio': 'danger',
      'divorcio': 'dark',
      'filiacion': 'primary',
      'alimentos': 'success',
      'regimenes': 'warning',
      'adopcion': 'secondary'
    };
    return colors[category] || 'medium';
  }

  async showConceptDetail(concept: LegalConcept) {
    const alert = await this.alertController.create({
      header: concept.title,
      subHeader: concept.articleRef,
      message: `
        <div style="text-align: left;">
          <p><strong>Descripción:</strong></p>
          <p>${concept.description}</p>
          <br>
          <p><strong>Contenido Detallado:</strong></p>
          <p>${concept.content}</p>
          <br>
          <p><strong>Última Actualización:</strong> ${concept.lastUpdated}</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Más Info',
          handler: () => {
            this.showMoreInfo(concept);
          }
        }
      ]
    });
    await alert.present();
  }

  async showMoreInfo(concept: LegalConcept) {
    const toast = await this.toastController.create({
      message: `Para más información sobre ${concept.title}, consulte ${concept.articleRef}`,
      duration: 3000,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-CL');
  }

  async openExternalLink(url: string) {
    const alert = await this.alertController.create({
      header: 'Enlace Externo',
      message: 'Está a punto de abrir un enlace externo a la Biblioteca del Congreso Nacional. ¿Desea continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Abrir',
          handler: () => {
            window.open(url, '_blank');
          }
        }
      ]
    });
    await alert.present();
  }

  async addConcept() {
    if (!this.isAdmin) return;

    const alert = await this.alertController.create({
      header: 'Agregar Concepto',
      message: 'Esta funcionalidad estará disponible próximamente para administradores.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
