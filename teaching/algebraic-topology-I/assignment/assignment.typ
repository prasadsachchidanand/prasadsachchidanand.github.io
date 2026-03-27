// ─────────────────────────────────────────────
//  Algebraic Topology I — Assignment Template
//  Dr. Sachchidanand Prasad · MTH 566
// ─────────────────────────────────────────────

// ── Colours ──────────────────────────────────
#let ink = rgb("#0f1117")
#let cream = rgb("#faf8f3")
#let accent = rgb("#c0392b")   // deep crimson
#let muted = rgb("#7f8c8d")
#let rule-col = rgb("#d5cfc4")

// ── Page setup ────────────────────────────────
#set page(
  paper: "a4",
  margin: (top: 2.4cm, bottom: 2.8cm, left: 2.6cm, right: 2.2cm),
  background: rect(fill: cream, width: 100%, height: 100%),
  header: context {
    if counter(page).get().first() > 1 {
      set text(size: 8pt, fill: muted, font: "New Computer Modern")
      grid(
        columns: (1fr, 1fr),
        align(left)[MTH 566 — Algebraic Topology I], align(right)[Dr. Sachchidanand Prasad],
      )
      v(-4pt)
      line(length: 100%, stroke: 0.4pt + rule-col)
    }
  },
  footer: context {
    set text(size: 8pt, fill: muted, font: "New Computer Modern")
    v(-4pt)
    line(length: 100%, stroke: 0.4pt + rule-col)
    v(2pt)
    grid(
      columns: (1fr, 1fr),
      align(left)[Deadline: 30 April],
      align(right)[
        Page #counter(page).display("1 of 1", both: true)
      ],
    )
  },
)

// ── Text defaults ─────────────────────────────
#set text(font: "New Computer Modern", size: 11pt, fill: ink)
#set par(justify: true, leading: 0.75em, spacing: 1.2em)
#set math.equation(numbering: "(1)")

// ── Heading styles ────────────────────────────
#show heading.where(level: 1): it => {
  v(1.4em)
  set text(size: 13pt, weight: "bold", fill: accent)
  block[
    #it.body
    #v(-0.55em)
    #line(length: 100%, stroke: 1.2pt + accent)
  ]
  v(0.5em)
}

#show heading.where(level: 2): it => {
  v(0.9em)
  set text(size: 11.5pt, weight: "bold", fill: ink)
  it.body
  v(0.2em)
}

// ── Problem counter & box ─────────────────────
#let prob-counter = counter("problem")

#let problem(pts: none, body) = {
  prob-counter.step()
  v(1.2em)
  block(
    width: 100%,
    fill: white,
    stroke: (left: 3pt + accent, rest: 0.5pt + rule-col),
    radius: 2pt,
    inset: (left: 14pt, right: 12pt, top: 10pt, bottom: 10pt),
  )[
    #grid(
      columns: (1fr, auto),
      {
        set text(weight: "bold", size: 11.5pt)
        [Problem #context prob-counter.display()]
      },
      if pts != none {
        set text(size: 9pt, fill: muted)
        align(right)[[#pts pts]]
      },
    )
    #v(0.4em)
    #set text(weight: "regular")
    #body
  ]
}

// ── Hint box ──────────────────────────────────
#let hint(body) = block(
  width: 100%,
  fill: rgb("#f0ede7"),
  stroke: (left: 2pt + muted),
  radius: 2pt,
  inset: (left: 10pt, right: 10pt, top: 7pt, bottom: 7pt),
)[
  #set text(size: 10pt, fill: muted)
  *Hint:* #body
]

// ── Definition box ────────────────────────────
#let defbox(term, body) = block(
  width: 100%,
  fill: rgb("#fdf6ee"),
  stroke: 0.6pt + rule-col,
  radius: 3pt,
  inset: 12pt,
)[
  #set text(size: 10.5pt)
  *Definition (#term).* #body
]

// ════════════════════════════════════════════════
//  TITLE BLOCK
// ════════════════════════════════════════════════
#v(-0.4cm)

// Decorative top rule
#stack(
  spacing: 0pt,
  rect(width: 100%, height: 4pt, fill: accent),
  rect(width: 100%, height: 1.5pt, fill: ink),
)

#v(1.2em)

#align(center)[
  #set text(font: "New Computer Modern")
  
  // Kicker
  #text(size: 9pt, fill: muted, tracking: 3pt)[
    IIIT Delhi
  ]
  
  #v(0.3em)
  
  // Main title
  #text(size: 26pt, weight: "bold", fill: ink)[
    Algebraic Topology I
  ]
  
  #v(0.1em)
  
  #text(size: 13pt, fill: accent)[
    MTH 566 — Problem Set
  ]
  
  #v(1em)
  
  // Meta grid
  #set text(size: 10pt)
  #grid(
    columns: (auto, auto, auto),
    column-gutter: 2.4em,
    stack(spacing: 3pt, text(fill: muted, size: 8pt, tracking: 1.5pt)[INSTRUCTOR], text(
      fill: ink,
      weight: "bold",
    )[Dr. Sachchidanand Prasad]),
    stack(spacing: 3pt, text(fill: muted, size: 8pt, tracking: 1.5pt)[COURSE CODE], text(
      fill: ink,
      weight: "bold",
    )[MTH 566]),
    stack(spacing: 3pt, text(fill: muted, size: 8pt, tracking: 1.5pt)[DEADLINE], text(
      fill: accent,
      weight: "bold",
    )[30 April]),
  )
  
  #v(1em)
]

// Bottom title rule
#stack(
  spacing: 0pt,
  rect(width: 100%, height: 1.5pt, fill: ink),
  rect(width: 100%, height: 4pt, fill: accent),
)

#v(0.6em)

// Student info strip
#block(
  width: 100%,
  fill: white,
  stroke: 0.6pt + rule-col,
  radius: 3pt,
  inset: (x: 16pt, y: 11pt),
)[
  #set text(size: 10pt)
  #grid(
    columns: (1fr, 1fr, 1fr),
    column-gutter: 1.5em,
    stack(spacing: 5pt, text(fill: muted, size: 8pt, tracking: 1pt)[NAME], line(
      length: 100%,
      stroke: 0.7pt + rule-col,
    )),
    stack(spacing: 5pt, text(fill: muted, size: 8pt, tracking: 1pt)[ROLL NUMBER], line(
      length: 100%,
      stroke: 0.7pt + rule-col,
    )),
    stack(spacing: 5pt, text(fill: muted, size: 8pt, tracking: 1pt)[DATE OF SUBMISSION], line(
      length: 100%,
      stroke: 0.7pt + rule-col,
    )),
  )
]

#v(0.3em)

// Instructions
#block(
  width: 100%,
  fill: rgb("#fff8f8"),
  stroke: (left: 3pt + accent),
  radius: 2pt,
  inset: (left: 12pt, right: 12pt, top: 9pt, bottom: 9pt),
)[
  #set text(size: 9.5pt)
  *Instructions:*
  All solutions must be written clearly with full justification.
  Cite any theorem you use by name.
  Late submissions will *not* be accepted.
  Collaboration is permitted, but write up solutions independently.
]

#show math.equation.where(block: true): eq => {
  block(width: 100%, inset: 0pt, align(center, eq))
}

#let bf(x) = $bold(upright(#x))$
#let to = $->$
#let GL(n, R) = $G L_#n (bb(#R))$
#let ip(x, y) = $lr(angle.l #x, #y angle.r)$
#let focus(content) = {
  text(fill: purple, style: "italic")[#content]
}
#let iff = $<=>$
#let cup = $union$
#let sim = $~$

// ════════════════════════════════════════════════
//  PROBLEMS
// ════════════════════════════════════════════════

= Section 1: Quotient Topology

#problem()[
  Recall that $q: X to Y$ is a map. Any subset of the form $q^(-1)(y) subset.eq X$ for some $y \in Y$ is called a #focus[fibre] of $q$. A subset $U subset.eq X$ is called #focus[saturated with respect to $q$] if $U = q^(-1)(V)$ for some $V subset.eq Y$. 
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Prove that $q$ is a quotient map if and only if every fibre of $q$ is an equivalence class of some equivalence relation on $X$.  
    ],

    [
      As you rememeber, we assume that q quotient map is surjective. Prove that an injective quotient map is a homeomorphism.
    ],

    [
      Let $q: X to Y$ be any map. For a subset $U subset.eq X$, show that the following are equivalent:
      #enum(
        indent: 1em,
        numbering: "a)",
        [
          $U$ is saturated with respect to $q$.
        ],
        [
          $U = q^(-1)q(U)$. 
        ],
        [
          $U$ is a union of fibres of $q$. 
        ],
        [
          If $x in U$, then every point $x' in X$ such that $q(x') = q(x)$ also belongs to $U$. 
        ]
      )
    ]
  )
]

#problem()[
  Suppose $q_i: X to Y_i$, $i = 1,2$ are two quotient maps. that make some identifications (that is, $q_1(x) = q_1(x')$ if and only if $q_2(x) = q_2(x')$). Then there is a unique homeomorphism $phi: Y_1 to Y_2$ such that $phi compose q_1 = q_2$.
]

#problem()[
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Given an action of a group $G$ on a space $X$ (not necessarily continuou action), we define a relation $sim$ on $X$ by declaring $x sim x'$ if and only if there is some $g in G$ such that $g dot x = x'$. Prove that $sim$ is an equivalence relation. Hence show that there is a bijection between the quotient set $X slash G$ and the set of equivalence classes of $sim$.  
    ],
    [
      Consider the action of $"GL"(n, RR)$ on $RR^n$ given by matrix (left) multiplication. Describe the equivalence relation $sim$ on $RR^n$ defined as above and identify the quotient set $RR^n slash "GL"(n, RR)$. Show that the quotient topology is not Hausdorff.
    ],
    [
      Consider the action of $"O"(n)$ on $RR^n$ given by matrix (left) multiplication. Describe the equivalence relation $sim$ on $RR^n$ defined as above and identify the quotient set $RR^n slash "O"(n)$. Show that the quotient space is homeomorphic to $[0, oo)$. 
    ]
  )
]

#pagebreak()
= Section 2: Category Theory

#problem()[
  #defbox("Functor")[
    A *functor* $F : cal(C) -> cal(D)$ between categories assigns to
    each object $X in cal(C)$ an object $F(X) in cal(D)$ and to each
    morphism $f : X -> Y$ a morphism $F(f) : F(X) -> F(Y)$, preserving
    identities and composition.
  ]
  
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Show that the fundamental group construction gives a functor
      $pi_1 : bold("Top")_* -> bold("Grp")$ from the category of based
      topological spaces to the category of groups.
    ],
    [
      Prove that a homeomorphism $f : (X, x_0) -> (Y, y_0)$ induces an
      isomorphism $f_* : pi_1(X, x_0) -> pi_1(Y, y_0)$.
    ]
  )
]

#pagebreak()
= Section 3: Fundamental Group and Retraction

#problem()[
  Let $X$ be path-connected topological space. 
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Let $f,g : [0,1] to X$ be two paths from $p$ to $q$. Show that $f sim g$ if and only if $f dot macron(g) sim c_p$, where $c_p$ is the constant path at $p$.       
    ],
    [
      Show that $X$ is simply connected if and only if any two paths in $X$ with the same endpoints are path homotopic. 
    ]
  ) 
]

#problem()[
  Let 
  $
    A = {1/n}: n in ZZ} " and " B = A cup {0}.
  $
  Show that $A$ and $B$ have not the same homotopy type.  
]

#problem()[
  Let $A subset.eq RR^2$ be bounded. Show that $A$ is simply connected if and only if $A$ and $RR^2 without A$ are connected.   
]

#problem()[
  Let $A subset.eq X$ be a subspace and $r : X -> A$ a retraction.
  
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Prove that the inclusion-induced map $i_* : pi_1(A, a_0) -> pi_1(X, a_0)$
      is injective.
    ],
    [
      Show that if $A$ is a retract of $X$ and $pi_1(X, a_0)$ is trivial,
      then so is $pi_1(A, a_0)$.
    ],
    [
       Give an example of a space $X$ and a subspace $A$ that is a retract
       but *not* a deformation retract of $X$.
    ]
  ) 
]

#problem()[
  Show that the Möbius band is homotopy equivalent to the circle. Hence compute the fundamental group of the Möbius band.
]

#problem()[
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Show that $TT^2 = SS^1 times SS^1$ is not homeomorphic to $SS^2$. (You can not use that the fundamental group of prodcut spaces is the direct product of the fundamental). You may use that the fundamental group of $SS^2$ is trivial.
    ],
    [
      The figure $8$ space (that is, the wedge sum of two circles) is not simply connected. 
    ]
  ) 
]

#problem()[
  Let $X$ and $Y$ be path-connected spaces with basepoints $x_0$ and
  $y_0$. Prove that
  $
    pi_1(X times Y, (x_0, y_0)) tilde.equiv pi_1(X, x_0) times pi_1(Y, y_0).
  $
  
  #hint[
    Use the projections $p_1 : X times Y -> X$ and $p_2 : X times Y -> Y$
    to construct inverse homomorphisms.
  ]
]

#pagebreak()
= Section 4: Covering Spaces & $pi_1(S^1)$

#problem()[
  Construct two non-homeomorphic covering spaces of the wedge sum of two circles. 
]

#problem(pts: 10)[
  Using $pi_1(S^1) tilde.equiv ZZ$, prove the *Brouwer Fixed-Point
  Theorem* in dimension 2: every continuous map $f : D^2 -> D^2$ has
  a fixed point.
  
  #hint[
    Assume for contradiction that $f$ has no fixed point and construct
    a retraction $r : D^2 -> S^1$.
  ]
]

#problem()[
  #enum(
    indent: 1em,
    numbering: "i)",
    spacing: 1em,
    [
      Let $f: S^1 -> SS^1$ be a continuous map such that $f compose f$ is nullhomotopic. Show that the induced map $f_* : pi_1(S^1) -> pi_1(SS^1)$ is trivial. 
    ],
    [
      Let $f: SS^1 to SS^1$ be given by $f(x) = -x$. Show that $f$ is homotopic to the identity map. (We will prove the analogue of this fact for higher dimensional spheres). 
    ]
  ) 
]
