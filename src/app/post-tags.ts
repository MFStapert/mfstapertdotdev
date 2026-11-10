import { Component, input } from '@angular/core';

@Component({
  selector: 'post-tags',
  host: { class: 'block' },
  template: `
    <ul class="flex list-none flex-wrap gap-small" aria-label="Tags">
      @for (tag of tags(); track tag) {
        <li class="rounded-full bg-primary px-small py-0.5 font-mono text-xs text-on-primary">
          #{{ tag }}
        </li>
      }
    </ul>
  `,
})
export class PostTags {
  readonly tags = input.required<string[]>();
}
