# Arshil Portfolio

## CHANGES

Full portfolio optimization

Assets
- High-quality WebP optimization for portraits, coffee artwork, polaroids, certificates, and recommendation letters.
- Removed unreferenced AVIF duplicates from the deployable public asset set.
- Recommendation letters remain visually unfiltered in the UI; their existing privacy masking is preserved in the source WebPs.
- Added lightweight skeleton states for certificate/recommendation image loading without changing their visual cards or layout.

Resume viewer
- The single source of truth is public/Arshil's resume.pdf.
- The PDF is A4, text-selectable, and uses embedded/subset fonts; high-quality image recompression reduced the supplied PDF from about 1.40 MB to about 694 KB.
- Both resume pages preload in parallel when the popup opens and stay cached until the popup closes.
- Normal PDF viewer and 3D folding renderer use the same PDF.
- PDF.js is loaded lazily and copied to public/pdfjs at build/dev time.
- Page navigation keeps the existing directional physical flip animation and wraps between both pages.
- Zoom, download, 3D launch, fold/unfold, return-to-PDF, and close controls remain.
- Download filename is exactly "Arshil's resume.pdf".
- 3D renderer keeps the galaxy background, 360° drag rotation, paper folding/unfolding animation, and reverse-side behavior while removing duplicate embedded resume artwork.

Runtime performance
- Memoized PortfolioSections and isolated theme/settings store updates so theme switching does not force a full portfolio-tree re-render.
- Kept hero/profile artwork preloaded and predecoded for instant theme and real-portrait transitions.
- Removed permanent GPU layer promotion from the four large hero image layers while retaining compositor-friendly transform/opacity transitions.
- Recommendation, certificate, and polaroid assets remain lazy/async decoded where appropriate.
- Added image skeletons only to genuinely asynchronous recommendation/certificate states.

2026-09-28 — profile artwork interaction / fluidity fix
- Tapping the hero artwork hides the two original sticky notes and shows the “Yep, that’s me.” note with the existing underlined “Wanna play??” play button intact.
- Tapping the artwork again restores the two original sticky notes and removes the play note with smooth enter/exit animations.
- Real portrait switches between arshil-real-light.webp and arshil-real-dark.webp according to theme.

## CHANGES_PROFILE_REAL

Profile tap update

- Tapping the profile artwork crossfades to public/arshil-real-light.webp / public/arshil-real-dark.webp.
- The existing "Yep, that’s me." / "Wanna play??" note remains intact.
- Tapping the artwork again crossfades back to the current cappuccino/espresso artwork.
- Added preload/decode for the real portrait so the tap transition does not wait for image decoding.
- Existing Tic-Tac-Toe play-button behavior is unchanged.

## CHANGES_STEP3

STEP 3 — SKILLS FOLDER

Replaced the previous Skills circular orbit/tap-to-reveal interaction with a FolderFloat-style burst presentation.

Interaction:
- Desktop: hover over the Skills folder to open it.
- Mobile: tap the folder to open/close it.
- Ten existing skill labels emerge from the folder with staggered spring/physics motion.
- Selecting a paper closes the folder (closeOnSelect=true), matching the supplied reference usage.
- Reduced-motion mode disables spring/animated motion.

Light theme (from supplied FolderFloat reference):
- folderColor #3f3f46
- frontColor #52525b
- paperColor #f5f5f5
- itemColor #f5f5f5
- itemTextColor #18181b
- labelColor #f5f5f5

Dark theme (new):
- folderColor #1b1714
- frontColor #2b2420
- paperColor #302925
- itemColor #302925
- itemTextColor #f7f0e6
- labelColor #ffffff

No later portfolio sections were changed by this step.

## CHANGES_STEP3_FIX

STEP 3 FIX — SKILLS FOLDER CENTERING

- Kept the supplied FolderFloat prop configuration: hover trigger, closeOnSelect, physics, drift 0.5, width 200, height 148, radius 14, spread 180, lift 26, tilt 8, flapAngle 34, restAngle 16, openDuration 520, stagger 45, bounce 0.3.
- Preserved the portfolio's existing 10 skill labels.
- Fixed the mobile/desktop centering bug caused by Motion's transform output overriding the CSS translate(-50%, -50%) centering transform.
- Folder and papers now use CSS centering offsets that remain compatible with Motion x/y transforms.
- No other portfolio section was changed.

## CHANGES_STEP3_FOLDERFLOAT_REFERENCE

Step 3 — FolderFloat reference alignment

- Reworked the Skills FolderFloat burst to match the supplied React Bits reference interaction: papers fan upward/outward from the folder instead of forming a circular orbit.
- Preserved the supplied FolderFloat parameters: width 200, height 148, radius 14, spread 180, lift 26, tilt 8, flapAngle 34, restAngle 16, openDuration 520ms, stagger 45ms, bounce 0.3, physics and drift 0.5.
- Preserved hover trigger on desktop and uses click on touch/mobile as a practical interaction fallback.
- Kept all 10 portfolio skills as individual selectable papers.
- Fixed paper centering so Motion transforms do not push the folder/papers off-center on narrow screens.
- Light theme uses the supplied FolderFloat palette. Espresso keeps a custom dark palette with readable light paper text.

## OPTIMIZATION_NOTES

Arshil Portfolio — Full Optimization Pass

Asset optimization
- Re-encoded/resized the visual WebP assets at high quality with metadata stripped; the displayed composition and dimensions are preserved.
- Removed unreferenced duplicate AVIF variants from the deployable public asset set.
- Kept recommendation-letter imagery unaltered in the UI; the source WebPs retain the existing privacy masking.
- Added lightweight skeleton states for recommendation letters and certificates so their boxes reserve space while the WebP decodes.
- Kept hero/profile artwork on direct preloading rather than skeletons so the tap-to-real-portrait interaction remains immediate.

Resume/PDF
- Rebuilt public/Arshil's resume.pdf with high-quality image recompression and structural PDF optimization while preserving A4 page dimensions, embedded/subset fonts, selectable text, and the existing page artwork.
- Final PDF is ~694 KB (from ~1.40 MB in the supplied optimized-source copy).
- Render comparison against the supplied PDF showed only small raster-image recompression differences (page 1 PSNR ~43.7 dB; page 2 ~69.2 dB at 150 dpi), with no layout or text changes.
- Normal PDF viewer and 3D folding renderer use the same public/Arshil's resume.pdf.
- PDF.js is loaded lazily and copied to public/pdfjs at build/dev time.
- Both resume pages are deduplicated/preloaded as soon as the resume popup opens and cached only for the popup lifetime.
- Closing the resume popup releases the rendered-page cache.

Runtime/React performance
- Stabilized the main React tree during theme switches so the full portfolio sections do not re-render unnecessarily.
- Memoized PortfolioSections; only components that actually subscribe to theme/game state update when those values change.
- Kept existing animation choreography and timing intact.
- Removed permanent will-change promotion from the four large overlapping hero images; transform-gpu and opacity/transform transitions remain, while the browser is no longer asked to keep four large image layers promoted at rest.
- Kept hero light/dark and real-portrait assets predecoded, with opposite-theme assets prefetched during idle time.
- Kept below-the-fold recommendation/certificate images lazy/async decoded.

3D resume
- Renderer still uses the real PDF pages as WebGL textures rather than embedded duplicate base64 artwork.
- Galaxy background, 360° drag rotation, fold/unfold GSAP animation, paper-side behavior, and visibility pausing remain intact.

## SETUP

Arshil Portfolio — optimized build

1. npm install
2. npm run dev
3. npm run build

Optimization notes:
- public/Arshil's resume.pdf is the single resume source for the normal viewer, download, and 3D folding view.
- PDF.js is copied into public/pdfjs at dev/build time and loaded only when the resume viewer is opened.
- The 3D folding renderer keeps the original Three.js/GSAP model and animations but renders textures from Arshil's resume.pdf instead of shipping embedded base64 artwork.
- Portfolio WebP images are recompressed at high quality with metadata removed; displayed dimensions and composition are preserved.
- Recommendation letters and certificates remain the original visual images, with lazy loading used for below-the-fold views.
- The legacy standalone folding-resume source is retained, but its embedded image data is also optimized rather than deleted.
- Vite sourcemaps remain disabled for smaller production output.
