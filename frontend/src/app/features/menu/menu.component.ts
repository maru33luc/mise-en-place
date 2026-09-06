import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '@core/services/recipe.service';
import { MenuService } from '@core/services/menu.service';
import type { Recipe } from '@core/models/recipe.model';
import type { DailyMenu, MenuItem, MenuSection } from '@core/models/work.model';

@Component({
  selector: 'app-menu', standalone: true, imports: [FormsModule],
  template: `<main class="workspace"><header><div><p class="eyebrow">Service planning</p><h1>Daily Menu</h1></div><label>Date<input type="date" [(ngModel)]="date" (change)="load()"></label><label>Guests<input type="number" min="1" [(ngModel)]="guests" (change)="save()"></label></header><div class="menu-grid"><section class="library"><h2>Recipe library <span>{{recipes.length}}</span></h2>@for(recipe of recipes;track recipe.id){<article draggable="true" (dragstart)="drag(recipe)"><span>{{recipe.season ?? 'all'}}</span><strong>{{recipe.title}}</strong><small>{{recipe.servings ?? 2}} portions · {{recipe.difficulty}}</small></article>}</section><section class="stations">@for(section of sections;track section){<div class="station" (dragover)="$event.preventDefault()" (drop)="drop(section)"><div class="station-head"><h2>{{labels[section]}}</h2><span>{{menu.sections[section].length}}</span></div>@for(item of menu.sections[section];track item.id){<article class="selected"><strong>{{item.title}}</strong><button (click)="remove(section,item.id)">×</button><small>{{scale(item.servings ?? 2)}} portions</small></article>}@if(!menu.sections[section].length){<p class="drop">Drop a recipe here</p>}</div>}</section></div><section class="shopping"><h2>Shopping list</h2><div class="shop-grid">@for(item of shopping;track item.name){<span>{{item.name}} <b>{{item.amount}} {{item.unit}}</b></span>}</div></section></main>`,
  styles: [`.workspace{max-width:1200px;margin:auto;padding:9rem 1.5rem 5rem}header{display:flex;align-items:end;gap:1.5rem;border-bottom:1px solid #29251f;padding-bottom:2.4rem}header>div{margin-right:auto}.eyebrow{color:#c9a96e;text-transform:uppercase;font:600 .65rem Inter;letter-spacing:.2em}h1{color:#eee0c8;font:500 clamp(3rem,7vw,6rem) 'Playfair Display';line-height:.9;margin-top:.8rem}h2{color:#eee0c8;font:500 1.7rem 'Playfair Display'}label{color:#988d7d;font:600 .6rem Inter;text-transform:uppercase;letter-spacing:.13em}input{display:block;margin-top:.5rem;background:#131313;border:1px solid #302a22;color:#d9cdb9;padding:.7rem;font:.8rem Inter}.menu-grid{display:grid;grid-template-columns:280px 1fr;gap:2rem;margin-top:2.5rem}.library{border-right:1px solid #29251f;padding-right:1.5rem}.library h2 span,.station-head span{color:#c9a96e;font:.65rem Inter;float:right}article{padding:1rem 0;border-bottom:1px solid #27231d;cursor:grab}article span,article small{display:block;color:#887d6e;text-transform:uppercase;font:600 .58rem Inter;letter-spacing:.12em}article strong{display:block;color:#d9ccb8;font:1rem 'Playfair Display';margin:.3rem 0}.stations{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.station{min-height:260px;border:1px dashed #383027;padding:1rem;background:#0d0d0d}.station-head{border-bottom:1px solid #29251f;padding-bottom:.7rem}.station-head h2{display:inline;font-size:1.4rem}.selected{position:relative}.selected button{position:absolute;right:0;top:.5rem;background:none;border:0;color:#887d6e;font-size:1.2rem;cursor:pointer}.drop{text-align:center;color:#62594f;font:.7rem Inter;margin-top:5rem}.shopping{margin-top:3rem;border-top:1px solid #29251f;padding-top:1.5rem}.shop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-top:1rem}.shop-grid span{border-bottom:1px solid #222;color:#a89b89;padding:.6rem;font:.75rem Inter}.shop-grid b{float:right;color:#c9a96e;font-weight:500}@media(max-width:800px){header{align-items:start;flex-wrap:wrap}.menu-grid{grid-template-columns:1fr}.library{border-right:0;border-bottom:1px solid #29251f;padding:0 0 1rem}.stations{grid-template-columns:1fr}.shop-grid{grid-template-columns:1fr}}`]
})
export class MenuComponent {
  private readonly recipesApi = inject(RecipeService);
  private readonly menuApi = inject(MenuService);
  recipes: Recipe[] = [];
  date = new Date().toISOString().slice(0, 10);
  guests = 20;
  sections: MenuSection[] = ['starters', 'mains', 'desserts'];
  labels: Record<MenuSection, string> = { starters: 'Starters', mains: 'Mains', desserts: 'Desserts' };
  menu: DailyMenu = { date: this.date, guestCount: 20, sections: { starters: [], mains: [], desserts: [] } };
  dragged: Recipe | null = null;
  constructor() { this.recipesApi.getAll().subscribe(r => this.recipes = r.data ?? []); this.load(); }
  load() { this.menuApi.get(this.date).subscribe({ next: r => { if (r.data) { this.menu = r.data; this.guests = r.data.guestCount; } }, error: () => undefined }); }
  drag(recipe: Recipe) { this.dragged = recipe; }
  drop(section: MenuSection) { if (!this.dragged) return; this.menu.sections[section] = [...this.menu.sections[section], { ...this.dragged, section }]; this.dragged = null; this.save(); }
  remove(section: MenuSection, id: number) { this.menu.sections[section] = this.menu.sections[section].filter((item: MenuItem) => item.id !== id); this.save(); }
  save() { this.menu = { ...this.menu, guestCount: this.guests }; this.menuApi.save(this.menu).subscribe(); }
  scale(servings: number) { return Math.round((this.guests / servings) * 10) / 10; }
  get shopping() { return this.sections.flatMap(s => this.menu.sections[s].flatMap(r => r.ingredients.map(i => ({ ...i, amount: Math.round(i.amount * (this.guests / (r.servings ?? 2)) * 10) / 10 })))).reduce((all, item) => { const found = all.find(x => x.name === item.name && x.unit === item.unit); if (found) found.amount += item.amount; else all.push({ ...item }); return all; }, [] as { name: string; amount: number; unit: string }[]); }
}
