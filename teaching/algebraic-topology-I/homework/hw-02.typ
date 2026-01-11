#import "template.typ": *
#let title = "Homework #2"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "review of point set topology"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#theory[
  #enum(
    indent: 1em, numbering: "i)",
    [
      Given a space $X$ and a subset $A subset X$, a point $x in X$ is called a #focus[limit point] (or #focus[cluster point], or #focus[point of accumulation]) of $A$ if for any open set $U subset X$, with $x in U$, we have $A inter U$ contains a point other than $x$.
    ],

    [
      Given $A subset X$, the #focus[closure] of $A$, denoted $overline(A)$ (or $"cl"(A)$), is the smallest closed set of $X$ that contains $A$.
    ],
    [
      Given $A subset X$, the #focus[interior] of $A$, denoted $circle(A)$ (or $"int"(A)$), is the largest open set contained in $A$. A point $x in circle(A)$ is called an #focus[interior point] of $A$.
    ],
    [
      Given $A subset X$, the #focus[boundary] of $A$, denoted $partial A$ (or $"bd"(A)$), is defined as
      $
        partial A = overline(A) inter overline((X without A)) .
      $
    ],
    [
      Given two topological spaces $(X, cal(T)_X)$ and $(Y, cal(T)_Y)$, a function $f : X -> Y$ is said to be a #focus[homeomorphism] if the following holds.
      #enum(
        numbering: "a)",
        indent: 1em,
        [
          $f$ is bijective, with inverse $f^(-1) : Y -> X$.
        ],
        [
          $f$ is continuous.
        ],
        [
          $f$ is open (or equivalently, $f^(-1)$ is continuous).
        ],
      )
    ]
  )
]

#pagebreak()

#prob[
  Show that if $A$ is a closed set of $X$, then $A$ contains all of its limit points. Give an example of a space $X$ and a subset $A subset X$, such that
  #enum(
    numbering: "i)",
    indent: 1em,
    [
      there is a limit point $x$ of $A$ which is not an element of $A$, and
    ],
    [
      there is an element $a in A$ which is not a limit point of $A$.
    ],
  )
]

#prob[
  Show the following. 
  #enum(
    numbering: "i)",
    indent: 1em,
    [
      For any $A subset X$, $circle(A)$ is the union of all open sets contained in $A$. In particular, show that $A subset X$ is open if and only if $A = circle(A)$.
    ],
    [
      Given $A subset X$, a point $x in X$ is an interior point of $A$ if and only if there exists some open set $U subset X$ such that $x in U subset A$.
    ],
  )
]

#prob[
  Compute the boundary of the following subsets $A subset X$.
  #enum(
    numbering: "a)",
    indent: 1em,
    [
      $X$ is any space, and $A = X$.
    ],
    [
      $X$ is any space, and $A = emptyset$.
    ],
    [
      $X$ is a discrete space, and $emptyset eq.not A subset.neq X$.
    ],
    [
      $X$ is an indiscrete space, and $emptyset eq.not A subset.neq X$.
    ],
    [
      $X = bb(R)$ and $A = bb(Z)$.
    ],
    [
      $X = bb(R)$ and $A = bb(Q)$.
    ],
    [
      $X = bb(R)$ and $A = { 1/n | n in bb(N) }$.
    ],
  )
]

#prob[
  Let $A subset X "and" B subset Y$ be two topological spaces. Let $X times Y$ be equipped with the product topology and $A times B$ be equipped with the subspace topology.

  #enum(
    indent: 1em, numbering: "i)",
    [
      Show that $A times B$ is homeomorphic to $B times A$.  
    ],
    [
      Prove that if $A, B$ are closed, then $A times B$ is closed in $X times Y$.  
    ],
    [
      Prove that $overline(A times B) = overline(A) times overline(B)$. Is it true for interiors? What about the boundaries? 
    ]
  ) 
]

#prob[
  #enum(
    indent: 1em, numbering: "i)",
    [
      Prove that a space $X$ is Hausdorff if and only if the diagonal $Delta = {(x, x) : x in X}$ is closed in $X times X$. 
    ],
    [
      Prove that if $Y$ is a Hausdorff space and $f: X to Y$ is a continuous map, then the graph 
      $
        Gamma_f := {(x,f(x)): x in X} subset.eq X times Y
      $  
      is closed in $X times Y$.
    ],
    [
      Let $Y$ be a compact space. Prove that if a map $f : X to Y$ has closed graph $Gamma_f$, then $f$ is continuous.    
    ]
  )
]

#prob[
  Let $f: RR to RR$ be a continuous function. Prove that its graph is 
  #set enum(numbering: "i)", indent: 1em)
  + closed;

  + connected;

  + path connected.
]

#prob[
  #focus("Pasting lemma:") Suppose $X = A union B$, for some closed sets $A, B subset X$. Let $f : A -> Y, g : B -> Y$ be given continuous maps, such that $f(x) = g(x)$ for any $x in A inter B$. Then, there exists a (unique) continuous map $h : X -> Y$ such that $ h(x) =
  cases(
    f(x) & #h(1em) x in A,
    g(x) & #h(1em) x in B.
  ) $
]

#prob[
  #enum(
    indent: 1em, numbering: "i)",
    [
      Prove that $RR^n without RR^m$ is homeomorphic to $SS^(n-m-1) times RR^(m+1)$.
    ],
    [
      Prove that 
      $
        SS^n sect {x in RR^(n+1): x_1 ^2 + dots + x_k^2 <= x_(k+1)^2 + dots + x_(n_1)^2}
      $
      is homeomorphic to $SS^(k-1) times DD^(n - k + 1)$. 
    ],
    [
      Prove that $ GL(n, RR)$ is homeomorphic to $S L_n (RR) times GL(1, RR)$.  
    ]
  )  
]