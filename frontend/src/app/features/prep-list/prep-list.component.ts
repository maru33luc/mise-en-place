import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrepListService } from '@core/services/prep-list.service';
import type { PrepStatus, PrepTask } from '@core/models/work.model';

@Component({
  selector: 'app-prep-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="workspace">
      <header>
        <div><p class="eyebrow">Before the first ticket</p><h1>Prep List</h1><p class="lede">Keep every task visible before service begins.</p></div>
        <div class="progress"><strong>{{ done() }} / {{ tasks().length }}</strong><span>tasks complete</span><i><em [style.width.%]="progress()"></em></i></div>
      </header>

      @if (errorMessage()) { <p class="error" role="alert">{{ errorMessage() }}</p> }
      <form (ngSubmit)="add()">
        <input name="name" [(ngModel)]="draft.name" placeholder="Add a preparation task..." required>
        <input name="minutes" type="number" min="0" [(ngModel)]="draft.estimatedMinutes" placeholder="Minutes">
        <select name="priority" [(ngModel)]="draft.priority"><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select>
        <button type="submit" [disabled]="saving()">{{ saving() ? 'Adding...' : 'Add task +' }}</button>
      </form>

      @if (loading()) { <p class="state">Loading preparation tasks...</p> }
      @else if (!tasks().length) { <p class="state empty">No preparation tasks yet. Add the first one above.</p> }
      @else {
        <section class="tasks" aria-label="Preparation tasks">
          @for (task of tasks(); track task.id) {
            <article [class.done]="task.status === 'done'">
              <button type="button" class="check" (click)="toggle(task)" [attr.aria-label]="task.status === 'done' ? 'Mark task pending' : 'Mark task done'">{{ task.status === 'done' ? '✓' : '○' }}</button>
              <div class="task-copy"><strong>{{ task.name }}</strong><small>{{ task.technique || 'mise en place' }} · {{ task.estimatedMinutes || 0 }} min · <b [class]="task.priority">{{ task.priority }}</b></small></div>
              <span class="timer">{{ time(task) }} <button type="button" (click)="toggleTimer(task)" [attr.aria-label]="running() === task.id ? 'Pause timer' : 'Start timer'">{{ running() === task.id ? 'Ⅱ' : '▶' }}</button></span>
              <button type="button" class="delete" (click)="remove(task)" aria-label="Delete task">×</button>
            </article>
          }
        </section>
      }
      <button type="button" class="archive" (click)="clearDone()" [disabled]="!done()">Archive completed prep</button>
    </main>
  `,
  styles: [`
    .workspace{max-width:1000px;margin:auto;padding:9rem 1.5rem 5rem}header{display:flex;align-items:end;border-bottom:1px solid #29251f;padding-bottom:2rem}.eyebrow{color:#c9a96e;text-transform:uppercase;font:600 .65rem Inter;letter-spacing:.2em;margin:0 0 .7rem}.lede{color:#817767;font:.85rem Inter}.workspace h1{color:#eee0c8;font:500 clamp(3rem,7vw,6rem) 'Playfair Display';line-height:.9;margin:0}.progress{margin-left:auto;width:180px}.progress strong{color:#eee0c8;font:1.2rem 'Playfair Display';display:block}.progress span{color:#817767;font:.6rem Inter;text-transform:uppercase;letter-spacing:.12em}.progress i{display:block;height:3px;background:#2b261f;margin-top:.8rem}.progress em{display:block;height:100%;background:#c9a96e;transition:width .3s}form{display:flex;gap:.6rem;margin:2rem 0}form input,select{background:#111;border:1px solid #302a22;color:#d9cdb9;padding:.85rem;font:.75rem Inter}form input:first-child{flex:1}form button,.archive{background:#c9a96e;border:0;color:#080808;padding:0 1.1rem;text-transform:uppercase;font:600 .63rem Inter;letter-spacing:.1em;cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}.error{padding:.8rem 1rem;background:rgba(120,40,40,.16);border:1px solid #633832;color:#f09a8c;font:.75rem Inter}.state{color:#817767;font:.8rem Inter;padding:2rem 0}.empty{border-top:1px solid #29251f}.tasks{border-top:1px solid #29251f}.tasks article{display:flex;align-items:center;gap:1rem;padding:1.2rem .5rem;border-bottom:1px solid #211e19}.check{border:1px solid #716042;background:none;color:#c9a96e;width:28px;height:28px;border-radius:50%;cursor:pointer}.task-copy{min-width:0}.tasks article strong{color:#e1d4c0;font:1.1rem 'Playfair Display'}.tasks small{display:block;color:#817767;font:.65rem Inter;margin-top:.35rem}.tasks small b{text-transform:uppercase}.high{color:#d47b6e}.medium{color:#c9a96e}.low{color:#829b85}.timer{margin-left:auto;color:#c9a96e;font:.8rem Inter;white-space:nowrap}.timer button,.delete{background:none;border:0;color:#a38e68;cursor:pointer}.delete{font-size:1.2rem}.done strong{text-decoration:line-through;color:#6b6258!important}.archive{margin-top:2rem;padding:.8rem 1.1rem;background:transparent;border:1px solid #6c5b3b;color:#c9a96e}@media(max-width:700px){header{display:block}.progress{margin:2rem 0 0;width:100%}form{flex-wrap:wrap}form input:first-child{flex-basis:100%}form input,form select,form button{flex:1;min-width:0}.timer{font-size:.65rem}.task-copy{flex:1}}
  `]
})
export class PrepListComponent implements OnDestroy {
  private readonly api = inject(PrepListService);
  readonly tasks = signal<PrepTask[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly draft: Partial<PrepTask> = { name: '', estimatedMinutes: 15, priority: 'medium' };
  readonly running = signal<number | null>(null);
  private interval?: ReturnType<typeof setInterval>;

  constructor() {
    this.api.getAll().subscribe({ next: (response) => { this.tasks.set(response.data ?? []); this.loading.set(false); }, error: () => { this.loading.set(false); this.errorMessage.set('Could not load preparation tasks.'); } });
  }

  readonly done = () => this.tasks().filter((task) => task.status === 'done').length;
  readonly progress = () => this.tasks().length ? this.done() / this.tasks().length * 100 : 0;

  add(): void {
    const name = String(this.draft.name ?? '').trim();
    if (!name) { this.errorMessage.set('Task name is required.'); return; }
    this.saving.set(true);
    this.errorMessage.set('');
    this.api.create({ ...this.draft, name }).subscribe({ next: (response) => { if (response.data) this.tasks.update((tasks) => [...tasks, response.data!]); this.saving.set(false); this.draft.name = ''; this.draft.estimatedMinutes = 15; this.draft.priority = 'medium'; }, error: () => { this.saving.set(false); this.errorMessage.set('Could not create the preparation task.'); } });
  }

  toggle(task: PrepTask): void {
    const status: PrepStatus = task.status === 'done' ? 'pending' : 'done';
    this.api.update(task.id, { status }).subscribe({ next: () => this.tasks.update((tasks) => tasks.map((item) => item.id === task.id ? { ...item, status } : item)), error: () => this.errorMessage.set('Could not update the task.') });
  }

  toggleTimer(task: PrepTask): void {
    if (this.running() === task.id) {
      this.stopTimer(task);
      return;
    }
    this.stopCurrentTimer();
    this.running.set(task.id);
    if (task.status === 'pending') this.updateLocalTask(task.id, { status: 'in-progress' });
    this.interval = setInterval(() => this.updateLocalTask(task.id, { elapsedSeconds: (this.findTask(task.id)?.elapsedSeconds ?? 0) + 1 }), 1000);
  }

  private stopTimer(task: PrepTask): void {
    this.stopCurrentTimer();
    this.api.update(task.id, { status: task.status, elapsedSeconds: task.elapsedSeconds }).subscribe({ error: () => this.errorMessage.set('Could not save timer progress.') });
  }

  private stopCurrentTimer(): void { if (this.interval) clearInterval(this.interval); this.interval = undefined; this.running.set(null); }
  private findTask(id: number): PrepTask | undefined { return this.tasks().find((task) => task.id === id); }
  private updateLocalTask(id: number, patch: Partial<PrepTask>): void { this.tasks.update((tasks) => tasks.map((task) => task.id === id ? { ...task, ...patch } : task)); }
  time(task: PrepTask): string { const seconds = task.elapsedSeconds ?? 0; return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  remove(task: PrepTask): void { this.api.delete(task.id).subscribe({ next: () => this.tasks.update((tasks) => tasks.filter((item) => item.id !== task.id)), error: () => this.errorMessage.set('Could not delete the task.') }); }
  clearDone(): void { this.api.clearDone().subscribe({ next: (response) => this.tasks.set(response.data ?? []), error: () => this.errorMessage.set('Could not archive completed tasks.') }); }
  ngOnDestroy(): void { this.stopCurrentTimer(); }
}
