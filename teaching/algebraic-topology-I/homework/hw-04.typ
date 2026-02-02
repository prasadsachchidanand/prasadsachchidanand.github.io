#import "template.typ": *
#let title = "Homework #4"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "category theory"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

// #theory[
//   #enum(
//     indent: 1em,
//     numbering: "i)",
//     [
    
//     ],
//   )
// ]

// #pagebreak()

#prob[
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Let $X$ be a set. Describe explicitly,
      #enum(
        indent: 1em,
        numbering: "a)",
        [
          the objects of the discrete category, $bf("Disc")$,
        ],
        [
          the morphisms,
        ],
        [
          composition.
        ],
      ) 
    ],
    [
      Show that every function $: X to Y$ defines a functor $bf("Disc")(X) to bf("Disc")(Y)$, and that every such functor arises uniquely this way.
    ]
  )
]

#prob[
  A binary relation $prec.eq$ on a set $X$ is called a preorder if it is reflexive and transitive. Define a category $scr(P)$ by: 
  $
    & "Obj": "elements of "P \
    & "a morphism" x to y "exists iff" x prec.eq y.
  $   
  Show that $scr(P)$ is a category. 
]

#prob[
  Show that every function $f: X to Y$ 
]

#prob[
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Let $X$ be a topological space and
      $
        C(X) := {f: X to X : f "is continuous"}.
      $
      Show that $C(X)$ is a commutative ring with unity under pointwise operations:
      $
        f + g := x mapsto f(x) + g(x) quad "and" quad f dot g : x mapsto f(x)g(x).
      $ 
      for all $x in X$. 
    ],
    [
      Show that $X mapsto C(X)$ gives a (contravariant) functor $bf("Top") to bf("Rings")$. 
    ]
  )
]

#prob[
  Let $p$ be a fixed prime in $ZZ$. Let $bf("Ab")$ be the category of abelain groups. Define a functor
  $
    F: bf("Ab") to bf("Ab"), quad G mapsto G\/p G \
    F(f) : x + p G mapsto f(x) + p H, 
  $  
  where $f: G to H$ is a group homomorphism. 
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Show that if $f$ is surjection, then $F(f)$ is a surjection.   
    ],
    [
      Give an example of an injective homomorphism $f$ for which $F(f)$ is not injective.   
    ]
  ) 
]

#prob[
  Let $scr(C)$ and $scr(D)$ be categories, and let $~$ be a congruence on $scr(C)$. If $T: scr(C) to scr(D)$ is a functor with $T(f) = T(g)$, whenever $f ~ g$, then $T$ defines a functor $T': scr(C)' to scr(D)$ by
  $
    T'(X) = T(X), "for any object " X quad "and" \
    T([f]) = T(f)  "for any morphism " f.
  $  
  where $scr(C)$ is the quotient cateogry
]

#prob[
  Let $G$ be a group. Show that $G$ gives rise to a cateogory $scr(G)$ with single object, denoted $*$, and such that $"Hom"_(scr(G)) (*, *) = G$.
]
   