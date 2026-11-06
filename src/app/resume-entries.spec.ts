import { loadResume } from './resume-entries';

describe('loadResume', () => {
  it('lists jobs newest filename first and keeps optional fields optional', () => {
    const jobs = loadResume();

    expect(jobs).toHaveLength(10);
    expect(jobs[0]?.attributes.employer).toBe('Xip');
    expect(jobs[0]?.attributes.title).toBe('Senior frontend developer');
    expect(jobs.at(-1)?.attributes.employer).toBe('Yourhosting');
    expect(jobs.find((job) => job.attributes.employer === 'Codefield')?.attributes.languages).toBeUndefined();
    expect(jobs.find((job) => job.attributes.title === 'Technical lead')?.attributes.technology).toBeUndefined();
    expect(jobs[0]?.body).toContain('<p>');
    expect(jobs[0]?.body).toContain('thieme Meulenhof');
    const avisi = jobs.find((job) => job.attributes.employer === 'Avisi');
    expect(avisi?.body.match(/<p>/g)?.length).toBeGreaterThan(1);
  });
});
