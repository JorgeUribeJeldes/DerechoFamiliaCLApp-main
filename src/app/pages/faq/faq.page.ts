import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ToastController, ActionSheetController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

interface Pregunta {
  id: number;
  pregunta: string;
  respuesta: string;
  categoria: string;
  articulos?: string[];
  expanded?: boolean;
  guardada?: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class FaqPage implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'todas';
  isOnline: boolean = navigator.onLine;
  filteredQuestions: Pregunta[] = [];

  preguntas: Pregunta[] = [
    {
      id: 1,
      pregunta: '¿Qué es la pensión alimenticia en Chile?',
      respuesta: 'La pensión alimenticia es una obligación legal establecida en el Código Civil chileno que consiste en proporcionar recursos económicos para cubrir las necesidades básicas de alimentación, vivienda, vestido, salud, educación y movilización de los hijos menores de edad o personas con discapacidad.',
      categoria: 'pension',
      articulos: ['Artículo 321 del Código Civil', 'Ley N° 14.908 sobre Abandono de Familia']
    },
    {
      id: 2,
      pregunta: '¿Hasta qué edad se debe pagar pensión alimenticia?',
      respuesta: 'En Chile, la pensión alimenticia se debe pagar hasta los 18 años. Sin embargo, puede extenderse hasta los 28 años si el hijo está estudiando una profesión u oficio, siempre que demuestre aprovechamiento y dedicación. También se mantiene indefinidamente para hijos con discapacidad.',
      categoria: 'pension',
      articulos: ['Artículo 332 del Código Civil']
    },
    {
      id: 3,
      pregunta: '¿Cómo se calcula el monto de la pensión alimenticia?',
      respuesta: 'El monto se determina considerando las necesidades del alimentario y las facultades económicas del alimentante. Los tribunales suelen aplicar una proporción del sueldo (generalmente entre 20% y 30% por hijo), pero cada caso se evalúa individualmente considerando gastos adicionales como educación y salud.',
      categoria: 'pension',
      articulos: ['Artículo 329 del Código Civil']
    },
    {
      id: 4,
      pregunta: '¿Qué es el cuidado personal de los hijos?',
      respuesta: 'El cuidado personal es el derecho y deber de los padres de tener consigo a sus hijos, cuidar de su crianza, educación y desarrollo integral. En Chile, puede ser ejercido por ambos padres (cuidado compartido) o por uno de ellos (cuidado exclusivo).',
      categoria: 'cuidado',
      articulos: ['Artículo 224 del Código Civil', 'Ley N° 20.680']
    },
    {
      id: 5,
      pregunta: '¿Qué es la relación directa y regular?',
      respuesta: 'Es el derecho del padre o madre que no tiene el cuidado personal del hijo a mantener un contacto directo con él. Incluye visitas, vacaciones, comunicación telefónica y otros medios. El tribunal establece un régimen específico considerando el interés superior del niño.',
      categoria: 'cuidado',
      articulos: ['Artículo 229 del Código Civil']
    },
    {
      id: 6,
      pregunta: '¿Cómo solicitar el divorcio en Chile?',
      respuesta: 'En Chile existen tres tipos de divorcio: por mutuo acuerdo, unilateral por culpa y unilateral sin culpa. Se debe presentar la demanda ante el Juzgado de Familia correspondiente. El divorcio por mutuo acuerdo es más rápido y económico.',
      categoria: 'divorcio',
      articulos: ['Ley N° 19.947 de Matrimonio Civil']
    },
    {
      id: 7,
      pregunta: '¿Cuáles son las causales de divorcio unilateral?',
      respuesta: 'Las causales incluyen: cese de la convivencia por al menos 3 años, violencia intrafamiliar, alcoholismo o drogadicción, tentativa contra la vida del cónyuge, condena por crimen o simple delito, y conducta homosexual. También existe el divorcio sin culpa tras un año de separación.',
      categoria: 'divorcio',
      articulos: ['Artículo 54 de la Ley de Matrimonio Civil']
    },
    {
      id: 8,
      pregunta: '¿Qué es la compensación económica en el divorcio?',
      respuesta: 'Es una prestación económica que puede solicitar el cónyuge que durante el matrimonio se dedicó al cuidado del hogar y/o hijos, o trabajó menos para dedicarse a la familia, si esto le causó un menoscabo económico. El monto depende de varios factores que evalúa el tribunal.',
      categoria: 'divorcio',
      articulos: ['Artículo 61 de la Ley de Matrimonio Civil']
    },
    {
      id: 9,
      pregunta: '¿Qué documentos necesito para iniciar un proceso de familia?',
      respuesta: 'Generalmente necesitas: cédula de identidad, certificado de nacimiento, certificado de matrimonio (si corresponde), liquidaciones de sueldo, declaración de renta, y cualquier documento que acredite los hechos que alegues. Cada proceso puede requerir documentos específicos.',
      categoria: 'general',
      articulos: ['Ley N° 19.968 que crea los Tribunales de Familia']
    },
    {
      id: 10,
      pregunta: '¿Puedo representarme a mí mismo en un juicio de familia?',
      respuesta: 'Sí, puedes representarte a ti mismo (autodefensa) en materias de familia. Sin embargo, se recomienda contar con asesoría legal debido a la complejidad de los procedimientos. Si no tienes recursos, puedes solicitar un abogado de turno gratuito.',
      categoria: 'general',
      articulos: ['Artículo 18 de la Ley N° 19.968']
    },
    {
      id: 11,
      pregunta: '¿Qué es la mediación familiar?',
      respuesta: 'Es un proceso voluntario donde un mediador neutral ayuda a las partes a llegar a acuerdos en materias de familia. Es obligatoria como requisito previo en casos de alimentos, cuidado personal y relación directa y regular. Es gratuita en el sistema público.',
      categoria: 'general',
      articulos: ['Ley N° 19.968', 'Ley N° 20.286']
    },
    {
      id: 12,
      pregunta: '¿Cómo funciona la violencia intrafamiliar en los tribunales?',
      respuesta: 'La violencia intrafamiliar puede ser denunciada en Carabineros, PDI o directamente en el tribunal. Se pueden decretar medidas de protección inmediatas como prohibición de acercamiento, salida del hogar del agresor, y otras. El proceso puede ser penal y civil simultáneamente.',
      categoria: 'general',
      articulos: ['Ley N° 20.066 sobre Violencia Intrafamiliar']
    },
    {
      id: 13,
      pregunta: '¿Qué es el régimen patrimonial del matrimonio?',
      respuesta: 'Es el conjunto de normas que regulan las relaciones económicas entre los cónyuges. En Chile existen tres regímenes: sociedad conyugal (por defecto), separación de bienes y participación en los gananciales. El régimen se puede cambiar mediante escritura pública.',
      categoria: 'matrimonio',
      articulos: ['Artículo 135 del Código Civil', 'Artículo 1715 del Código Civil']
    },
    {
      id: 14,
      pregunta: '¿Cómo se modifica una pensión de alimentos?',
      respuesta: 'La pensión se puede aumentar, reducir o cesar mediante demanda ante el Juzgado de Familia. Se debe demostrar cambios sustanciales en las necesidades del alimentario o en las capacidades económicas del alimentante. También se puede modificar por acuerdo entre las partes.',
      categoria: 'pension',
      articulos: ['Artículo 332 del Código Civil', 'Ley N° 14.908']
    },
    {
      id: 15,
      pregunta: '¿Qué es la inhabilidad parental?',
      respuesta: 'Es la privación o limitación de la patria potestad cuando el padre o madre pone en peligro la seguridad, salud o moralidad del hijo. Puede ser temporal o definitiva, y se decreta judicialmente. Las causales incluyen maltrato, abandono, alcoholismo o drogadicción.',
      categoria: 'cuidado',
      articulos: ['Artículo 267 del Código Civil', 'Artículo 226 del Código Civil']
    },
    {
      id: 16,
      pregunta: '¿Cuáles son los requisitos para contraer matrimonio en Chile?',
      respuesta: 'Los contrayentes deben ser mayores de 18 años (o mayores de 16 con autorización), no tener impedimentos legales, consentir libre y espontáneamente, y cumplir con las formalidades civiles. Se requiere manifestación ante el Oficial del Registro Civil y dos testigos hábiles.',
      categoria: 'matrimonio',
      articulos: ['Artículo 5° Ley de Matrimonio Civil', 'Artículo 102 del Código Civil']
    },
    {
      id: 17,
      pregunta: '¿Qué es la separación judicial?',
      respuesta: 'Es una medida que permite a los cónyuges vivir separados sin disolver el matrimonio. Puede ser por mutuo acuerdo o por falta imputable a uno de los cónyuges. Los efectos incluyen la suspensión de la vida en común y del régimen patrimonial, pero mantiene el estado civil de casado.',
      categoria: 'divorcio',
      articulos: ['Artículo 26 Ley de Matrimonio Civil']
    },
    {
      id: 18,
      pregunta: '¿Cómo funciona la mediación familiar obligatoria?',
      respuesta: 'Es un requisito previo al juicio en materias de alimentos, cuidado personal y relación directa y regular. El proceso es gratuito, confidencial y dirigido por un mediador neutral. Si no se logra acuerdo, se otorga certificado de mediación frustrada para continuar en tribunales.',
      categoria: 'general',
      articulos: ['Artículo 106 Ley N° 19.968', 'Ley N° 20.286']
    },
    {
      id: 19,
      pregunta: '¿Qué son las medidas de protección en violencia intrafamiliar?',
      respuesta: 'Son órdenes judiciales urgentes para proteger a víctimas de violencia. Incluyen prohibición de acercamiento, salida temporal del hogar del agresor, prohibición de comunicación, y otras medidas cautelares. Se pueden decretar de manera inmediata y tienen vigencia determinada.',
      categoria: 'general',
      articulos: ['Artículo 7° Ley N° 20.066', 'Artículo 92 Ley N° 19.968']
    },
    {
      id: 20,
      pregunta: '¿Qué es la filiación y cómo se determina?',
      respuesta: 'La filiación es la relación de parentesco entre padres e hijos. Se determina por naturaleza (biológica) o por adopción. La filiación matrimonial se presume del matrimonio, la no matrimonial se establece por reconocimiento voluntario o sentencia judicial. También existe investigación de paternidad/maternidad.',
      categoria: 'general',
      articulos: ['Artículo 179 del Código Civil', 'Artículo 184 del Código Civil']
    }
  ];

  constructor() {
    this.router = inject(Router);
    this.databaseService = inject(DatabaseService);
    this.menuController = inject(MenuController);
    this.toastController = inject(ToastController);
    this.actionSheetController = inject(ActionSheetController);
  }

  private router: Router;
  private databaseService: DatabaseService;
  private menuController: MenuController;
  private toastController: ToastController;
  private actionSheetController: ActionSheetController;

  ngOnInit() {
    this.filteredQuestions = [...this.preguntas];
    this.loadSavedQuestions();
    
    // Escuchar cambios en el estado de conexión
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  async loadSavedQuestions() {
    try {
      const savedQuestions = await this.databaseService.getCachedData('saved_questions');
      if (savedQuestions) {
        const savedIds = JSON.parse(savedQuestions);
        this.preguntas.forEach(pregunta => {
          pregunta.guardada = savedIds.includes(pregunta.id);
        });
      }
    } catch (error) {
      console.error('Error loading saved questions:', error);
    }
  }

  filterQuestions() {
    let filtered = [...this.preguntas];

    // Filtrar por categoría
    if (this.selectedCategory !== 'todas') {
      filtered = filtered.filter(p => p.categoria === this.selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.pregunta.toLowerCase().includes(term) || 
        p.respuesta.toLowerCase().includes(term)
      );
    }

    this.filteredQuestions = filtered;
  }

  filterByCategory() {
    this.filterQuestions();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'todas';
    this.filteredQuestions = [...this.preguntas];
  }

  toggleQuestion(pregunta: Pregunta) {
    pregunta.expanded = !pregunta.expanded;
  }

  getCategoryColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      'pension': 'primary',
      'cuidado': 'secondary',
      'divorcio': 'tertiary',
      'matrimonio': 'success',
      'general': 'medium'
    };
    return colors[categoria] || 'medium';
  }

  getCategoryIcon(categoria: string): string {
    const icons: { [key: string]: string } = {
      'pension': 'cash-outline',
      'cuidado': 'heart-outline',
      'divorcio': 'document-text-outline',
      'matrimonio': 'people-outline',
      'general': 'information-circle-outline'
    };
    return icons[categoria] || 'help-circle-outline';
  }

  async shareQuestion(pregunta: Pregunta) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir pregunta',
      buttons: [
        {
          text: 'Copiar enlace',
          icon: 'copy-outline',
          handler: () => {
            this.copyToClipboard(pregunta);
          }
        },
        {
          text: 'Compartir por WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.shareWhatsApp(pregunta);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async copyToClipboard(pregunta: Pregunta) {
    const text = `${pregunta.pregunta}\n\n${pregunta.respuesta}\n\nFuente: App Derecho de Familia Chile`;
    
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Pregunta copiada al portapapeles');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      this.showToast('Error al copiar la pregunta');
    }
  }

  shareWhatsApp(pregunta: Pregunta) {
    const text = encodeURIComponent(`${pregunta.pregunta}\n\n${pregunta.respuesta}\n\nFuente: App Derecho de Familia Chile`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  }

  async saveQuestion(pregunta: Pregunta) {
    try {
      pregunta.guardada = !pregunta.guardada;
      
      // Obtener preguntas guardadas actuales
      let savedQuestions: number[] = [];
      const cached = await this.databaseService.getCachedData('saved_questions');
      if (cached) {
        savedQuestions = JSON.parse(cached);
      }

      if (pregunta.guardada) {
        if (!savedQuestions.includes(pregunta.id)) {
          savedQuestions.push(pregunta.id);
        }
        this.showToast('Pregunta guardada');
      } else {
        savedQuestions = savedQuestions.filter(id => id !== pregunta.id);
        this.showToast('Pregunta eliminada de guardados');
      }

      // Guardar en storage local
      await this.databaseService.cacheData('saved_questions', JSON.stringify(savedQuestions));

    } catch (error) {
      console.error('Error saving question:', error);
      this.showToast('Error al guardar la pregunta');
      pregunta.guardada = !pregunta.guardada; // Revertir cambio
    }
  }

  trackByPregunta(index: number, pregunta: Pregunta): number {
    return pregunta.id;
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark.toString());
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
