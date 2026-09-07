import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '@core/services/recipe.service';
import { MenuService } from '@core/services/menu.service';
import type { Recipe } from '@core/models/recipe.model';
import type { DailyMenu, MenuItem, MenuSection } from '@core/models/work.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="workspace">
      <header class="page-header">
        <div><p class="eyebrow">Service planning</p><h1>Daily Menu</h1><p class="lede">Build tonight's service by dragging recipes into each course.</p></div>
        <div class="controls"><label>Date<input type="date" [(ngModel)]="date" (change)="load()"></label><label>Guests<input type="number" min="1" [(ngModel)]="guests" (change)="save()"></label></div>
      </header>

      @if (errorMessage()) { <p class="error" role="alert">{{ errorMessage() }}</p> }
      @if (saving()) { <p class="saving">Saving menu...</p> }

      <div class="menu-grid">
        <section class="library" aria-labelledby="library-title">
          <div class="section-heading"><div><p class="eyebrow">Available dishes</p><h2 id="library-title">Recipe library</h2></div><span class="count">{{ recipes().length }}</span></div>
          @if (loadingRecipes()) { <p class="state">Loading recipes...</p> }
          @else if (!recipes().length) { <p class="state">No recipes available. Create a recipe first, then return here.</p> }
          @else {
            <div class="recipe-list">
              @for (recipe of recipes(); track recipe.id) {
                <article class="recipe-source" draggable="true" (dragstart)="drag($event, recipe)">
                  <div class="recipe-source-copy"><span class="meta">{{ recipe.difficulty }} · {{ recipe.servings ?? 2 }} servings</span><strong>{{ recipe.title }}</strong><small>{{ recipe.ingredients.length }} ingredients</small></div>
                  <div class="quick-add"><button type="button" title="Add to starters" (click)="add(recipe, 'starters')">S</button><button type="button" title="Add to mains" (click)="add(recipe, 'mains')">M</button><button type="button" title="Add to desserts" (click)="add(recipe, 'desserts')">D</button></div>
                </article>
              }
            </div>
            <p class="hint">Drag a dish to a course, or use S / M / D to add it directly.</p>
          }
        </section>

        <section class="stations" aria-label="Menu courses">
          @for (section of sections; track section) {
            <div class="station" [class.over]="dragOver === section" (dragover)="allowDrop($event, section)" (dragleave)="dragOver = null" (drop)="drop($event, section)">
              <div class="station-head"><h2>{{ labels[section] }}</h2><span>{{ menu.sections[section].length }}</span></div>
              @for (item of menu.sections[section]; track item.id) {
                <article class="selected"><div><strong>{{ item.title }}</strong><small>{{ scale(item.servings ?? 2) }} portions · {{ item.difficulty }}</small></div><button type="button" aria-label="Remove {{ item.title }}" (click)="remove(section, item.id)">×</button></article>
              }
              @if (!menu.sections[section].length) { <p class="drop">Drop a recipe here</p> }
            </div>
          }
        </section>
      </div>

      <section class="shopping"><div class="section-heading"><div><p class="eyebrow">Service inventory</p><h2>Shopping list</h2></div></div>@if (!shopping.length) { <p class="state">Add recipes to generate your shopping list.</p> } @else { <div class="shop-grid">@for (item of shopping; track item.name + item.unit) { <span>{{ item.name }} <b>{{ item.amount }} {{ item.unit }}</b></span> }</div> }</section>
    </main>
  `,
  styles: [`
    .workspace{max-width:1200px;margin:auto;padding:9rem 1.5rem 5rem}.page-header{display:flex;align-items:end;gap:2rem;border-bottom:1px solid #29251f;padding-bottom:2.4rem}.page-header>div:first-child{margin-right:auto}.eyebrow{color:#c9a96e;text-transform:uppercase;font:600 .65rem Inter;letter-spacing:.2em;margin:0 0 .55rem}.lede{color:#817767;font:.85rem Inter;margin:1rem 0 0;max-width:420px}h1{color:#eee0c8;font:500 clamp(3rem,7vw,6rem) 'Playfair Display';line-height:.9;margin:0}h2{color:#eee0c8;font:500 1.7rem 'Playfair Display';margin:0}.controls{display:flex;gap:.8rem}.controls label{color:#988d7d;font:600 .6rem Inter;text-transform:uppercase;letter-spacing:.13em}.controls input{display:block;margin-top:.5rem;background:#131313;border:1px solid #302a22;color:#d9cdb9;padding:.7rem;font:.8rem Inter}.error{padding:.8rem 1rem;background:rgba(120,40,40,.16);border:1px solid #633832;color:#f09a8c;font:.75rem Inter}.saving{color:#c9a96e;font:.7rem Inter}.menu-grid{display:grid;grid-template-columns:330px 1fr;gap:2.5rem;margin-top:2.5rem}.section-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:1rem}.count,.station-head span{color:#c9a96e;font:600 .7rem Inter}.library{border-right:1px solid #29251f;padding-right:2rem}.recipe-list{border-top:1px solid #29251f}.recipe-source{display:flex;align-items:center;gap:.75rem;padding:1rem 0;border-bottom:1px solid #29251f;cursor:grab}.recipe-source:active{cursor:grabbing}.recipe-source-copy{min-width:0;flex:1}.recipe-source strong{display:block;color:#d9ccb8;font:1.05rem 'Playfair Display';margin:.25rem 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.meta,.recipe-source small{display:block;color:#817767;text-transform:uppercase;font:600 .57rem Inter;letter-spacing:.1em}.quick-add{display:flex;gap:.25rem}.quick-add button{width:25px;height:25px;border:1px solid #594d37;background:transparent;color:#c9a96e;font:600 .6rem Inter;cursor:pointer}.quick-add button:hover{background:#c9a96e;color:#080808}.hint,.state{color:#71675c;font:.7rem/1.5 Inter}.hint{margin-top:1rem}.stations{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.station{min-height:270px;border:1px dashed #383027;padding:1rem;background:#0d0d0d;transition:.2s}.station.over{border-color:#c9a96e;background:#15120c;transform:translateY(-2px)}.station-head{display:flex;justify-content:space-between;border-bottom:1px solid #29251f;padding-bottom:.7rem;margin-bottom:.2rem}.station-head h2{font-size:1.4rem}.selected{display:flex;justify-content:space-between;gap:.5rem;padding:1rem 0;border-bottom:1px solid #25211b}.selected strong{display:block;color:#d9ccb8;font:1rem 'Playfair Display'}.selected small{display:block;color:#817767;font:.6rem Inter;margin-top:.3rem}.selected button{background:none;border:0;color:#a38e68;font-size:1.2rem;cursor:pointer}.drop{text-align:center;color:#62594f;font:.7rem Inter;margin-top:5rem}.shopping{margin-top:3rem;border-top:1px solid #29251f;padding-top:1.5rem}.shop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem}.shop-grid span{border-bottom:1px solid #222;color:#a89b89;padding:.6rem;font:.75rem Inter}.shop-grid b{float:right;color:#c9a96e;font-weight:500}@media(max-width:850px){.page-header{display:block}.controls{margin-top:1.5rem}.menu-grid{grid-template-columns:1fr}.library{border-right:0;border-bottom:1px solid #29251f;padding:0 0 1.5rem}.stations{grid-template-columns:1fr}.shop-grid{grid-template-columns:1fr}}
  `]
})
export class MenuComponent {
  private readonly recipesApi = inject(RecipeService);
  private readonly menuApi = inject(MenuService);
  readonly recipes = signal<Recipe[]>([]);
  date = new Date().toISOString().slice(0, 10);
  guests = 20;
  sections: MenuSection[] = ['starters', 'mains', 'desserts'];
  labels: Record<MenuSection, string> = { starters: 'Starters', mains: 'Mains', desserts: 'Desserts' };
  menu: DailyMenu = { date: this.date, guestCount: 20, sections: { starters: [], mains: [], desserts: [] } };
  dragged: Recipe | null = null;
  dragOver: MenuSection | null = null;
  readonly loadingRecipes = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.recipesApi.getAll().subscribe({ next: (response) => { this.recipes.set(response.data ?? []); this.loadingRecipes.set(false); }, error: () => { this.loadingRecipes.set(false); this.errorMessage.set('Could not load recipes. Please sign in again or create a recipe first.'); } });
    this.load();
  }

  load() { this.menuApi.get(this.date).subscribe({ next: (response) => { if (response.data) { this.menu = response.data; this.guests = response.data.guestCount; } }, error: (error) => { if (error.status !== 404) this.errorMessage.set('Could not load this menu.'); } }); }
  drag(event: DragEvent, recipe: Recipe) { this.dragged = recipe; event.dataTransfer?.setData('text/plain', String(recipe.id)); if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'; }
  allowDrop(event: DragEvent, section: MenuSection) { event.preventDefault(); this.dragOver = section; if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'; }
  drop(event: DragEvent, section: MenuSection) { event.preventDefault(); if (this.dragged) this.add(this.dragged, section); this.dragged = null; this.dragOver = null; }
  add(recipe: Recipe, section: MenuSection) { const item: MenuItem = { ...recipe, section }; this.menu.sections[section] = [...this.menu.sections[section], item]; this.save(); }
  remove(section: MenuSection, id: number) { this.menu.sections[section] = this.menu.sections[section].filter((item) => item.id !== id); this.save(); }
  save() { this.saving.set(true); this.errorMessage.set(''); this.menu = { ...this.menu, guestCount: this.guests }; this.menuApi.save(this.menu).subscribe({ next: () => this.saving.set(false), error: () => { this.saving.set(false); this.errorMessage.set('Could not save the daily menu.'); } }); }
  scale(servings: number) { return Math.round((this.guests / servings) * 10) / 10; }
  get shopping() { return this.sections.flatMap((section) => this.menu.sections[section].flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ ...ingredient, amount: Math.round(ingredient.amount * (this.guests / (recipe.servings ?? 2)) * 10) / 10 })))).reduce((all, item) => { const found = all.find((entry) => entry.name === item.name && entry.unit === item.unit); if (found) found.amount += item.amount; else all.push({ ...item }); return all; }, [] as { name: string; amount: number; unit: string }[]); }
}
