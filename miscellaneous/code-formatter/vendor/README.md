# Formatter files for the code formatter

These are copies of the official browser builds, so the code formatter (`../index.html`,
`../formatter.js`) does not depend on other websites. The file contents are unchanged;
only the Prettier files were renamed from `.mjs` to `.js`.

| Folder | Formatter | Version | Source | Licence |
| --- | --- | --- | --- | --- |
| `tex-fmt/` | tex-fmt (LaTeX) | web build downloaded on 19 Nov 2026 (the page shows the version) | <https://wgunderwood.github.io/tex-fmt/pkg/> | MIT, `tex-fmt/LICENSE` |
| `bibtex-tidy/` | bibtex-tidy (BibTeX) | 1.15.1 | npm `bibtex-tidy` | MIT, `bibtex-tidy/LICENSE` |
| `typstyle/` | typstyle (Typst) | 0.15.1 | npm `@typstyle/typstyle-wasm-bundler` | Apache-2.0, `typstyle/LICENSE` |
| `prettier/` | Prettier (HTML, with the CSS and JavaScript plugins) | 3.9.10 | npm `prettier`: `standalone.mjs` and `plugins/{html,postcss,babel,estree}.mjs` | MIT, `prettier/LICENSE` and `prettier/THIRD-PARTY-NOTICES.md` |
| `prism/` | Prism (syntax colours for LaTeX and HTML; BibTeX and Typst rules are in `../syntax.js`) | 1.30.0 | npm `prismjs`: `components/prism-{core,markup,css,clike,javascript,latex}.min.js` | MIT, `prism/LICENSE` |

To update a formatter, replace the files in its folder with the new version (same file names)
and change the version number in the credits on `../index.html`.
The Prism files are loaded by `<script>` tags at the end of `../index.html`.
