// @ts-check
/**
 * Central glossary for `[[Term]]` wikilinks used in MDX bodies — same shape as
 * the ai-stack glossary. One entry per term, keyed by a lowercase id; the
 * theme's remarkGlossary plugin resolves each marker at build time, and an
 * unknown term fails the build.
 */
export const glossary = {
  comfyui: {
    label: 'ComfyUI',
    stack: 'comfyui',
  },
  // Definition-only term (no page — links to its glossary entry):
  diffusion: {
    label: { ko: '디퓨전 모델', en: 'Diffusion model' },
    def: {
      ko: '노이즈에서 이미지를 점진적으로 복원하도록 학습된 생성 모델 — 현대 이미지 생성의 표준 계열.',
      en: 'A generative model trained to gradually denoise toward an image — the standard family behind modern image generation.',
    },
  },
};
