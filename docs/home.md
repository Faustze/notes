Давай переработаем главную страницу — три карточки разделов со счётчиками вместо голого списка, бейджи стека, блок «недавно обновлено» и ссылки на тг/гитхаб внизу. Внимательно прочитай весь контекст снизу и прими конечное решение по странице на основе контекста.

Под Quartz это реализуется так:
- **Карточки** — просто HTML/JSX-блок прямо в `index.md` (Quartz поддерживает вставку компонентов через `quartz/components`), либо кастомный компонент `Cards.tsx`, который маппит массив разделов
- **Счётчики** (12 тестов, 47 задач) — можно высчитывать на билде через `getStaticPaths`-подобную логику, считая файлы в папках `headhunter/` и `leetcode/`, либо просто руками обновлять раз в неделю
- **«Недавно обновлено»** — в Quartz уже есть готовый компонент `RecentNotes`, нужно только подключить его в `quartz.layout.ts` и передать `limit`
- **Бейджи стека** — статичный HTML, без логики
- **Шейдер** — оставляешь как фон сверху, карточки идут блоком ниже, под текущими двумя строками

Если хочешь, могу написать конкретный `.tsx`-компонент под Quartz v5 (с типами Quartz `QuartzComponent`) — скинь структуру `quartz.layout.ts` или просто скажи, что используешь стандартный лейаут, и соберу компонент с нуля.


пример страницы:
```html
<div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;">
<div style="width:44px;height:44px;border-radius:50%;background:var(--color-background-secondary);display:flex;align-items:center;justify-content:center;font-weight:500;font-size:14px;">FZ</div>
<div>
<p style="font-weight:500;font-size:16px;margin:0;">Artem — frontend developer</p>
<p style="font-size:13px;color:var(--color-text-secondary);margin:0;">10 лет опыта, прокачиваю фундамент: Vue 3, Nuxt, TypeScript. Готовлюсь к интервью.</p>
</div>
</div>

<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1.5rem;">
<span style="font-size:12px;padding:4px 10px;border-radius:var(--border-radius-md);background:var(--color-background-secondary);color:var(--color-text-secondary);">Vue 3</span>
<span style="font-size:12px;padding:4px 10px;border-radius:var(--border-radius-md);background:var(--color-background-secondary);color:var(--color-text-secondary);">Nuxt 4</span>
<span style="font-size:12px;padding:4px 10px;border-radius:var(--border-radius-md);background:var(--color-background-secondary);color:var(--color-text-secondary);">TypeScript</span>
<span style="font-size:12px;padding:4px 10px;border-radius:var(--border-radius-md);background:var(--color-background-secondary);color:var(--color-text-secondary);">Pinia</span>
<span style="font-size:12px;padding:4px 10px;border-radius:var(--border-radius-md);background:var(--color-background-secondary);color:var(--color-text-secondary);">Vuetify 3</span>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:1.5rem;">
<a href="#" style="text-decoration:none;color:inherit;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;display:block;">
<i class="ti ti-briefcase" style="font-size:20px;" aria-hidden="true"></i>
<p style="font-weight:500;font-size:15px;margin:10px 0 4px;">Headhunter</p>
<p style="font-size:13px;color:var(--color-text-secondary);margin:0 0 10px;">Решения тестов закрепления навыков на hh.ru</p>
<p style="font-size:13px;color:var(--color-text-info);margin:0;">12 тестов · JS easy/middle <i class="ti ti-arrow-right" style="font-size:14px;vertical-align:-2px;" aria-hidden="true"></i></p>
</a>
<a href="#" style="text-decoration:none;color:inherit;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;display:block;">
<i class="ti ti-code" style="font-size:20px;" aria-hidden="true"></i>
<p style="font-weight:500;font-size:15px;margin:10px 0 4px;">LeetCode</p>
<p style="font-size:13px;color:var(--color-text-secondary);margin:0 0 10px;">Решения задач на leetcode.com, TypeScript</p>
<p style="font-size:13px;color:var(--color-text-info);margin:0;">47 задач · monotonic stack, regex <i class="ti ti-arrow-right" style="font-size:14px;vertical-align:-2px;" aria-hidden="true"></i></p>
</a>
<a href="#" style="text-decoration:none;color:inherit;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;display:block;">
<i class="ti ti-rocket" style="font-size:20px;" aria-hidden="true"></i>
<p style="font-weight:500;font-size:15px;margin:10px 0 4px;">Roadmap</p>
<p style="font-size:13px;color:var(--color-text-secondary);margin:0 0 10px;">18 проектов на пути к senior: Vue, Nuxt, TS, CSS</p>
<p style="font-size:13px;color:var(--color-text-info);margin:0;">проект 1/18 · Todo App <i class="ti ti-arrow-right" style="font-size:14px;vertical-align:-2px;" aria-hidden="true"></i></p>
</a>
</div>

<div style="background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:1rem;margin-bottom:1.5rem;">
<p style="font-size:13px;color:var(--color-text-secondary);margin:0 0 10px;">Недавно обновлено</p>
<div style="display:flex;flex-direction:column;gap:8px;">
<div style="display:flex;justify-content:space-between;font-size:13px;"><span>JavaScript middle level</span><span style="color:var(--color-text-tertiary);">21 июн</span></div>
<div style="display:flex;justify-content:space-between;font-size:13px;"><span>739. Daily Temperatures</span><span style="color:var(--color-text-tertiary);">18 июн</span></div>
<div style="display:flex;justify-content:space-between;font-size:13px;"><span>125. Valid Palindrome</span><span style="color:var(--color-text-tertiary);">15 июн</span></div>
</div>
</div>

<div style="display:flex;gap:8px;">
<a href="#" style="flex:1;text-align:center;font-size:13px;padding:8px;border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);color:var(--color-text-secondary);text-decoration:none;"><i class="ti ti-brand-telegram" style="font-size:14px;vertical-align:-2px;margin-right:4px;" aria-hidden="true"></i>t.me/faustdoc</a>
<a href="#" style="flex:1;text-align:center;font-size:13px;padding:8px;border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);color:var(--color-text-secondary);text-decoration:none;"><i class="ti ti-brand-github" style="font-size:14px;vertical-align:-2px;margin-right:4px;" aria-hidden="true"></i>GitHub</a>
</div>
```

Далее контекст:
```md
Учитывая что у тебя Quartz v5 — там кастомные TSX-компоненты теперь оформляются как отдельные npm-пакеты (фабричная функция, свой package.json), это тяжеловато ради одной секции на главной. Практичнее два шага: **raw HTML прямо в `index.md`** (GFM-плагин у тебя включён и пропускает сырой HTML) + немного CSS в `quartz/styles/custom.scss`. Получится то же самое, без сборки отдельного плагина.

**1. В `content/index.md` после текущих двух строк:**

```html
<div class="profile-row">
  <div class="avatar">FZ</div>
  <div>
    <p class="profile-name">Artem — frontend developer</p>
    <p class="profile-bio">10 лет опыта, прокачиваю фундамент: Vue 3, Nuxt, TypeScript. Готовлюсь к интервью.</p>
  </div>
</div>

<div class="stack-badges">
  <span>Vue 3</span><span>Nuxt 4</span><span>TypeScript</span><span>Pinia</span><span>Vuetify 3</span>
</div>

<div class="section-cards">
  <a href="/headhunter" class="section-card">
    <p class="card-title">Headhunter</p>
    <p class="card-desc">Решения тестов закрепления навыков на hh.ru</p>
    <p class="card-meta">12 тестов · JS easy/middle →</p>
  </a>
  <a href="/leetcode" class="section-card">
    <p class="card-title">LeetCode</p>
    <p class="card-desc">Решения задач на leetcode.com, TypeScript</p>
    <p class="card-meta">47 задач · monotonic stack, regex →</p>
  </a>
</div>
```

**2. В `quartz/styles/custom.scss`:**

```scss
.profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--lightgray);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  .profile-name {
    font-weight: 600;
    margin: 0;
  }
  .profile-bio {
    font-size: 0.85rem;
    color: var(--darkgray);
    margin: 0;
  }
}

.stack-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  span {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 6px;
    background: var(--lightgray);
    color: var(--darkgray);
  }
}

.section-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 1.5rem;
}

.section-card {
  display: block;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: var(--secondary);
  }
  .card-title {
    font-weight: 600;
    margin: 0 0 4px;
  }
  .card-desc {
    font-size: 0.85rem;
    color: var(--darkgray);
    margin: 0 0 10px;
  }
  .card-meta {
    font-size: 0.85rem;
    color: var(--secondary);
    margin: 0;
  }
}
```

Цвета (`var(--lightgray)`, `var(--secondary)` и т.д.) подхватятся из твоей текущей палитры в `quartz.config.yaml` — для light и dark режима автоматически, ничего хардкодить не нужно.

**3. Recent notes — у тебя плагин уже есть, просто включи:**

```yaml
  - source: github:quartz-community/recent-notes
    enabled: true
    options:
      limit: 5
    layout:
      position: beforeBody
      priority: 60
      condition: is-index
```

(`condition: is-index` — чтобы блок появлялся только на главной, а не на каждой странице; если такого condition нет в твоей версии, проверь доступные значения в `quartz-plugins.schema.json`, там обычно `is-index` или `index` — могу глянуть схему, если скинешь).

Счётчики задач («12 тестов», «47 задач») пока проще обновлять руками раз в неделю — автоматический подсчёт файлов в папке потребует уже полноценного кастомного плагина с `transformer`, это отдельная история, если понадобится — могу собрать.
```
