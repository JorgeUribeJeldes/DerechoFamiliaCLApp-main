import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

interface ConceptoLegal {
  id: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  categoria: string;
  icono: string;
  color: string;
  articulos: number;
  lectura: string;
  detalles: {
    definicion: string;
    caracteristicas: string[];
    ejemplos: string[];
    articulosRelacionados: string[];
    casos: string[];
  };
}

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.page.html',
  styleUrls: ['./conceptos.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class ConceptosPage implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'todas';
  conceptos: ConceptoLegal[] = [];
  filteredConcepts: ConceptoLegal[] = [];

  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  ngOnInit() {
    this.loadConceptos();
    this.filteredConcepts = [...this.conceptos];
  }

  loadConceptos(): void {
    this.conceptos = [
      {
        id: '1',
        titulo: 'Matrimonio',
        resumen: 'Contrato solemne por el cual un hombre y una mujer se unen actual e indisolublemente.',
        descripcion: 'El matrimonio es la base legal de la familia en Chile, regulado por el Código Civil desde el artículo 102.',
        categoria: 'matrimonio',
        icono: 'heart',
        color: 'danger',
        articulos: 15,
        lectura: '5 min',
        detalles: {
          definicion: 'Según el artículo 102 del Código Civil, el matrimonio es un contrato solemne por el cual un hombre y una mujer se unen actual e indisolublemente, y por toda la vida, con el fin de vivir juntos, de procrear, y de auxiliarse mutuamente.',
          caracteristicas: [
            'Es un contrato solemne',
            'Requiere consentimiento libre',
            'Debe celebrarse ante oficial civil',
            'Crea derechos y obligaciones recíprocas'
          ],
          ejemplos: [
            'Matrimonio civil',
            'Matrimonio religioso con efectos civiles'
          ],
          articulosRelacionados: ['Art. 102 CC', 'Art. 103 CC', 'Ley 19.947'],
          casos: [
            'Requisitos de validez',
            'Impedimentos matrimoniales',
            'Efectos del matrimonio'
          ]
        }
      },
      {
        id: '2',
        titulo: 'Divorcio',
        resumen: 'Disolución del vínculo matrimonial por sentencia judicial.',
        descripcion: 'El divorcio pone fin al matrimonio y permite contraer nuevas nupcias.',
        categoria: 'matrimonio',
        icono: 'documents',
        color: 'warning',
        articulos: 12,
        lectura: '7 min',
        detalles: {
          definicion: 'El divorcio es la disolución del matrimonio válido y disoluble, regulado por la Ley 19.947 de Matrimonio Civil.',
          caracteristicas: [
            'Requiere sentencia judicial',
            'Puede ser por mutuo acuerdo o unilateral',
            'Debe existir causal legal',
            'Permite contraer nuevo matrimonio'
          ],
          ejemplos: [
            'Divorcio por cese de convivencia',
            'Divorcio por violación grave de deberes',
            'Divorcio por mutuo acuerdo'
          ],
          articulosRelacionados: ['Art. 54 LMC', 'Art. 55 LMC', 'Art. 56 LMC'],
          casos: [
            'Divorcio contencioso',
            'Divorcio de común acuerdo',
            'Efectos patrimoniales'
          ]
        }
      },
      {
        id: '3',
        titulo: 'Patria Potestad',
        resumen: 'Conjunto de derechos y deberes que corresponden al padre o a la madre sobre los hijos.',
        descripcion: 'La patria potestad comprende el cuidado personal, la representación legal y la administración de bienes.',
        categoria: 'filiacion',
        icono: 'people',
        color: 'primary',
        articulos: 20,
        lectura: '8 min',
        detalles: {
          definicion: 'La patria potestad es el conjunto de derechos y deberes que corresponden al padre o a la madre sobre los hijos no emancipados.',
          caracteristicas: [
            'Se ejerce hasta la mayoría de edad',
            'Incluye cuidado personal',
            'Comprende representación legal',
            'Administración de bienes del menor'
          ],
          ejemplos: [
            'Autorización para viajes',
            'Representación en contratos',
            'Decisiones médicas'
          ],
          articulosRelacionados: ['Art. 243 CC', 'Art. 244 CC', 'Art. 245 CC'],
          casos: [
            'Patria potestad compartida',
            'Suspensión de patria potestad',
            'Conflictos de representación'
          ]
        }
      },
      {
        id: '4',
        titulo: 'Pensión Alimenticia',
        resumen: 'Obligación de proporcionar alimentos a quienes tienen derecho por ley.',
        descripcion: 'Los alimentos comprenden todo lo necesario para la subsistencia, habitación, vestido, salud, movilización y educación.',
        categoria: 'alimentos',
        icono: 'wallet',
        color: 'success',
        articulos: 18,
        lectura: '6 min',
        detalles: {
          definicion: 'Los alimentos son las asistencias que por ley se dan a ciertas personas para su subsistencia.',
          caracteristicas: [
            'Derecho personalísimo',
            'Intransferible e irrenunciable',
            'No se puede compensar',
            'Se debe desde la demanda'
          ],
          ejemplos: [
            'Alimentos entre cónyuges',
            'Alimentos a hijos menores',
            'Alimentos a ascendientes'
          ],
          articulosRelacionados: ['Art. 321 CC', 'Art. 323 CC', 'Art. 327 CC'],
          casos: [
            'Cálculo de pensión alimenticia',
            'Aumento o rebaja de alimentos',
            'Cumplimiento forzado'
          ]
        }
      },
      {
        id: '5',
        titulo: 'Adopción',
        resumen: 'Institución que crea entre adoptante y adoptado los mismos derechos y obligaciones que la filiación.',
        descripcion: 'La adopción permite que una persona sea hijo de quien no es su padre o madre biológico.',
        categoria: 'filiacion',
        icono: 'heart-circle',
        color: 'secondary',
        articulos: 22,
        lectura: '9 min',
        detalles: {
          definicion: 'La adopción es una institución en virtud de la cual una persona adquiere la calidad de hijo de otra o otras personas.',
          caracteristicas: [
            'Crea filiación adoptiva',
            'Es irrevocable',
            'Confiere apellido',
            'Otorga derechos hereditarios'
          ],
          ejemplos: [
            'Adopción simple',
            'Adopción plena',
            'Adopción internacional'
          ],
          articulosRelacionados: ['Ley 19.620', 'Art. 8 Ley 19.620'],
          casos: [
            'Proceso de adopción',
            'Requisitos para adoptar',
            'Efectos de la adopción'
          ]
        }
      },
      {
        id: '6',
        titulo: 'Sociedad Conyugal',
        resumen: 'Régimen patrimonial que rige por defecto en el matrimonio chileno.',
        descripcion: 'La sociedad conyugal es el régimen patrimonial legal supletorio en Chile, donde se forma una masa común de bienes.',
        categoria: 'patrimonio',
        icono: 'business',
        color: 'success',
        articulos: 18,
        lectura: '8 min',
        detalles: {
          definicion: 'Régimen patrimonial del matrimonio en que se forma entre los cónyuges una sociedad de bienes que se disuelve por ciertas causales específicas.',
          caracteristicas: [
            'Se forma automáticamente en el matrimonio',
            'El marido es administrador por ley',
            'Existen bienes sociales y propios',
            'Se disuelve por muerte, divorcio o separación'
          ],
          ejemplos: [
            'Bienes adquiridos durante el matrimonio',
            'Frutos de bienes propios',
            'Sueldos y salarios'
          ],
          articulosRelacionados: ['Art. 1715 CC', 'Art. 1725 CC', 'Art. 1792 CC'],
          casos: [
            'Administración de bienes sociales',
            'Liquidación de la sociedad conyugal',
            'Recompensas entre patrimonios'
          ]
        }
      },
      {
        id: '7',
        titulo: 'Separación de Bienes',
        resumen: 'Régimen donde cada cónyuge mantiene la propiedad y administración de sus bienes.',
        descripcion: 'Régimen patrimonial donde no se forma sociedad conyugal y cada cónyuge conserva sus bienes.',
        categoria: 'patrimonio',
        icono: 'albums',
        color: 'warning',
        articulos: 8,
        lectura: '4 min',
        detalles: {
          definicion: 'Régimen patrimonial en que cada cónyuge conserva la propiedad y administración de sus bienes presentes y futuros.',
          caracteristicas: [
            'Cada cónyuge administra sus bienes',
            'No hay bienes comunes',
            'Requiere pacto en capitulaciones matrimoniales',
            'Puede pactarse antes o durante el matrimonio'
          ],
          ejemplos: [
            'Pacto en capitulaciones matrimoniales',
            'Decreto judicial de separación de bienes',
            'Cambio de régimen durante el matrimonio'
          ],
          articulosRelacionados: ['Art. 159 CC', 'Art. 1723 CC', 'Art. 1792-1 CC'],
          casos: [
            'Administración independiente',
            'Responsabilidad por deudas propias',
            'Contribución a gastos familiares'
          ]
        }
      },
      {
        id: '8',
        titulo: 'Reconocimiento de Paternidad',
        resumen: 'Acto jurídico por el cual se establece la filiación no matrimonial.',
        descripcion: 'Procedimiento para establecer legalmente la relación filial entre padre e hijo nacido fuera del matrimonio.',
        categoria: 'filiacion',
        icono: 'person-add',
        color: 'tertiary',
        articulos: 12,
        lectura: '6 min',
        detalles: {
          definicion: 'Acto jurídico por el cual una persona declara que otra es su hijo, estableciendo entre ambos el vínculo de filiación.',
          caracteristicas: [
            'Puede ser voluntario o forzado',
            'Es irrevocable una vez hecho',
            'Produce efectos desde el nacimiento',
            'Confiere todos los derechos del hijo'
          ],
          ejemplos: [
            'Reconocimiento espontáneo ante oficial civil',
            'Reconocimiento en escritura pública',
            'Sentencia judicial de paternidad'
          ],
          articulosRelacionados: ['Art. 185 CC', 'Art. 187 CC', 'Art. 203 CC'],
          casos: [
            'Investigación de paternidad',
            'Efectos del reconocimiento',
            'Derechos hereditarios del hijo'
          ]
        }
      },
      {
        id: '9',
        titulo: 'Autorización para Salir del País',
        resumen: 'Permiso requerido para que menores de edad viajen al extranjero.',
        descripcion: 'Trámite legal necesario cuando un menor de edad debe viajar fuera de Chile con uno o sin ambos padres.',
        categoria: 'filiacion',
        icono: 'airplane',
        color: 'primary',
        articulos: 6,
        lectura: '3 min',
        detalles: {
          definicion: 'Autorización legal requerida para que menores de edad puedan salir del territorio nacional, otorgada por quien ejerce la patria potestad.',
          caracteristicas: [
            'Obligatoria para menores de 18 años',
            'Debe ser específica para cada viaje',
            'Puede ser temporal o permanente',
            'Se otorga ante notario o en aeropuerto'
          ],
          ejemplos: [
            'Autorización notarial simple',
            'Autorización con vigencia específica',
            'Permiso judicial cuando hay desacuerdo'
          ],
          articulosRelacionados: ['Art. 49 Ley N° 16.618', 'DL N° 1.094'],
          casos: [
            'Viaje con uno de los padres',
            'Viaje con terceros',
            'Autorización judicial por desacuerdo'
          ]
        }
      },
      {
        id: '10',
        titulo: 'Compensación Económica',
        resumen: 'Prestación que puede corresponder al cónyuge más débil en el divorcio.',
        descripcion: 'Derecho a una prestación económica para equilibrar el menoscabo económico sufrido por uno de los cónyuges.',
        categoria: 'matrimonio',
        icono: 'card',
        color: 'secondary',
        articulos: 10,
        lectura: '7 min',
        detalles: {
          definicion: 'Derecho que la ley otorga al cónyuge que, como consecuencia del matrimonio y de su ruptura, hubiere experimentado un menoscabo económico significativo.',
          caracteristicas: [
            'No es automática, debe solicitarse',
            'Se evalúa caso a caso',
            'Considera duración del matrimonio',
            'Puede pagarse en cuotas o al contado'
          ],
          ejemplos: [
            'Cónyuge que dejó de trabajar por familia',
            'Pérdida de expectativas laborales',
            'Dedicación al cuidado de hijos'
          ],
          articulosRelacionados: ['Art. 61 LMC', 'Art. 62 LMC', 'Art. 66 LMC'],
          casos: [
            'Cálculo del menoscabo económico',
            'Modalidades de pago',
            'Modificación de la compensación'
          ]
        }
      },
      {
        id: '11',
        titulo: 'Violencia Intrafamiliar',
        resumen: 'Todo maltrato que afecte la vida o integridad física o psíquica de miembros de la familia.',
        descripcion: 'La violencia intrafamiliar es un delito que requiere protección inmediata de las víctimas y sanción del agresor.',
        categoria: 'proteccion',
        icono: 'shield-checkmark',
        color: 'danger',
        articulos: 10,
        lectura: '5 min',
        detalles: {
          definicion: 'Según la Ley N° 20.066, constituye violencia intrafamiliar todo maltrato que afecte la vida o la integridad física o psíquica de quien tenga o haya tenido la calidad de cónyuge del ofensor o una relación de convivencia con él.',
          caracteristicas: [
            'Puede ser física, psicológica o sexual',
            'Incluye amenazas y privación arbitraria de libertad',
            'Permite medidas de protección urgentes',
            'Es perseguible de oficio'
          ],
          ejemplos: [
            'Violencia física',
            'Violencia psicológica',
            'Violencia económica',
            'Violencia sexual'
          ],
          articulosRelacionados: ['Ley N° 20.066', 'Art. 494 CP'],
          casos: [
            'Medidas de protección',
            'Proceso penal',
            'Reparación del daño'
          ]
        }
      },
      {
        id: '12',
        titulo: 'Bien Familiar',
        resumen: 'Protección especial del hogar de residencia de la familia.',
        descripcion: 'El bien familiar es una institución que protege el inmueble donde reside la familia, impidiendo actos de disposición sin consentimiento del cónyuge.',
        categoria: 'patrimonio',
        icono: 'home',
        color: 'success',
        articulos: 6,
        lectura: '4 min',
        detalles: {
          definicion: 'El bien familiar es una limitación al derecho de propiedad que protege el inmueble que sirve de residencia principal de la familia, requiriendo autorización del cónyuge o del tribunal para enajenar, gravar o prometer gravar.',
          caracteristicas: [
            'Se aplica al inmueble de residencia familiar',
            'Requiere declaración judicial',
            'Protege a cónyuge e hijos',
            'Impide desalojo arbitrario'
          ],
          ejemplos: [
            'Casa habitación familiar',
            'Departamento familiar',
            'Muebles del hogar'
          ],
          articulosRelacionados: ['Art. 141 CC', 'Art. 142 CC'],
          casos: [
            'Declaración de bien familiar',
            'Efectos de la declaración',
            'Alzamiento del bien familiar'
          ]
        }
      },
      {
        id: '13',
        titulo: 'Medidas de Protección',
        resumen: 'Órdenes judiciales urgentes para proteger a víctimas de violencia.',
        descripcion: 'Las medidas de protección son resoluciones judiciales que buscan evitar la repetición de actos de violencia y proteger a las víctimas.',
        categoria: 'proteccion',
        icono: 'shield',
        color: 'warning',
        articulos: 7,
        lectura: '5 min',
        detalles: {
          definicion: 'Las medidas de protección son resoluciones fundadas y motivadas dictadas por el tribunal competente a favor de la víctima de violencia intrafamiliar.',
          caracteristicas: [
            'Son de carácter cautelar',
            'Se decretan de manera urgente',
            'Tienen duración determinada',
            'Son modificables según circunstancias'
          ],
          ejemplos: [
            'Prohibición de acercamiento',
            'Salida del hogar del agresor',
            'Prohibición de comunicación',
            'Retención de documentos'
          ],
          articulosRelacionados: ['Art. 7° Ley N° 20.066', 'Art. 92 Ley N° 19.968'],
          casos: [
            'Solicitud de medidas',
            'Cumplimiento de medidas',
            'Incumplimiento de medidas'
          ]
        }
      }
    ];
  }

  filterConcepts(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered: ConceptoLegal[] = [...this.conceptos];

    // Filtrar por categoría
    if (this.selectedCategory !== 'todas') {
      filtered = filtered.filter((concepto: ConceptoLegal) => concepto.categoria === this.selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter((concepto: ConceptoLegal) => 
        concepto.titulo.toLowerCase().includes(this.searchTerm) ||
        concepto.resumen.toLowerCase().includes(this.searchTerm) ||
        concepto.descripcion.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredConcepts = filtered;
  }

  async showConceptDetail(concepto: ConceptoLegal) {
    const alert = await this.alertController.create({
      header: concepto.titulo,
      message: `
        <div style="text-align: left;">
          <p><strong>Descripción:</strong></p>
          <p>${concepto.descripcion}</p>
          
          <p><strong>Definición:</strong></p>
          <p>${concepto.detalles.definicion}</p>
          
          ${concepto.detalles.caracteristicas && concepto.detalles.caracteristicas.length > 0 ? `
            <p><strong>Características:</strong></p>
            <ul>
              ${concepto.detalles.caracteristicas.map((car: string) => `<li>${car}</li>`).join('')}
            </ul>
          ` : ''}
          
          ${concepto.detalles.ejemplos && concepto.detalles.ejemplos.length > 0 ? `
            <p><strong>Ejemplos:</strong></p>
            <ul>
              ${concepto.detalles.ejemplos.map((ej: string) => `<li>${ej}</li>`).join('')}
            </ul>
          ` : ''}
          
          ${concepto.detalles.articulosRelacionados && concepto.detalles.articulosRelacionados.length > 0 ? `
            <p><strong>Artículos relacionados:</strong></p>
            <ul>
              ${concepto.detalles.articulosRelacionados.map((art: string) => `<li>${art}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `,
      buttons: ['Cerrar']
    });
    await alert.present();
  }
}
