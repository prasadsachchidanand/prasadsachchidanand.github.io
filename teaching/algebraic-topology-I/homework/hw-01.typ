#import "template.typ": *
#let title = "Homework #1"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "review of point set topology"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#theory[
  #enum(
    [Given a set $X$, a #focus[relation] on it is a subset $cal(R) subset X times X$. We say $cal(R)$ is an #focus[equivalence relation] if the following holds.
    #enum(
      numbering: "a)",
      indent: 1em,
      [ *(Reflexive)* For each $x in X$ we have $(x, x) in cal(R)$.
      ],
      [ *(Symmetric)* If $(x,y) in cal(R)$, then $(y, x) in cal(R)$.
      ],
      [ *(Transitive)* If $(x, y) in cal(R)$ and $(y,z) in cal(R)$, then $(x, z) in cal(R)$.
      ],
    )
    For any $x in X$, the #focus[equivalence class] (with respect to the equivalence relation $cal(R)$) is defined as the set
    $
      [x] := { y in X | (x, y) in cal(R) } .
    $
    We shall denote $x attach(tilde, br: cal(R)) y$ (sometimes also denoted $x cal(R) y$, or simply $x tilde y$) whenever $(x, y) in cal(R)$. The collection of equivalence classes are sometimes denoted as $X slash_tilde$.],
    
    [
      Given a set $X$, a #focus[topology] on $X$ is a collection $cal(T)$ of subsets of $X$ (i.e., $cal(T) subset cal(P) (X)$), such that the following holds.
      #enum(
        numbering: "a)",
        indent: 1em,
        [
          $emptyset in cal(T)$ and $X in cal(T)$.
        ],
        [
          $cal(T)$ is closed under arbitrary unions. That is, for any collection of elements $U_alpha in cal(T)$ with $alpha in cal(I)$, an indexing set, we have $union.big_( alpha in cal(I) ) U_alpha in cal(T)$.
        ],
        [
          $cal(T)$ is closed under finite intersections. That is, for any finite collection of elements $U_1, dots ,U_n in cal(T)$, we have $inter.big_(i=1)^n U_i in cal(T)$.
        ],
      )
      The tuple $(X, cal(T) )$ is called a topological space. 

      Given any set $X$ we always have two standard topologies on it.
      #enum(
        numbering: "a)",
        indent: 1em,
        [ *(Discrete Topology)* $cal(T)_0 = cal(P) (X)$.
        ],
        [ *(Indiscrete Topology)* $cal(T)_1 = { emptyset , X }$.
        ],
      )
      They are distinct whenever $X$ has at least $2$ points.
    ], 

    [
      Given a topological space $(X, cal(T) )$, a subset $U subset X$ is called an #focus[open set] if $U in cal(T)$, and a subset $C subset X$ is called a #focus[closed set] if $X without C in cal(T)$ (i.e., if $X without C$ is open).
    ],

    [
      Given a topological space $(X, cal(T) )$, a #focus[basis] for it is a sub-collection $cal(B) subset cal(T)$ of open sets such that every open set $U in cal(T)$ can be written as the union of some elements of $cal(B)$.
    ],

    [
      Given a topological space $(X, cal(T) )$ and a subset $A subset X$, the #focus[subspace topology] on $A$ is defined as the collection
      $
        cal(T)_A := { U subset A | U = A inter O "for some" O in cal(T) } .
      $
      We say $(A, cal(T)_A)$ is a subspace of $(X, cal(T) )$.
    ],

    [
      Given two topological spaces $(X, cal(T)_X)$ and $(Y, cal(T)_Y)$, a function $f : X -> Y$ is said to be #focus[continuous] if $f^(-1)(U) in cal(T)_X$ for any $U in cal(T)_Y$ (i.e., pre-image of open sets are open).
    ]
  )
]

#pagebreak()
#prob[
  #set enum(numbering: "i)", indent: 1em)
  + Given an equivalence relation $cal(R)$ on $X$, check that any two equivalence classes are either disjoint or equal (i.e., they cannot have nontrivial intersection).

  + Suppose $X$ is a given set, and $A subset X$ is a nonempty subset. Define the relation $cal(R) subset X times X$ as follows.
  $
    cal(R) := { (x,x) | x in X without A } union { (a,b) | a, b in A } .
  $
  #enum(
    numbering: "a)",
    indent: 2.5em,
    [
      Check that $cal(R)$ is an equivalence relation.
    ],
    [
      Identify the equivalence classes. We shall denote the collection of equivalence classes as $X slash A$.
    ],
    [
      What is $X slash X$ ?
    ],
  )
]

#prob[
  #enum(indent: 1em, 
        numbering: "i)",
      [
        Given any set $X$, verify that both the discrete and the indiscrete topologies are indeed topologies, that is, check that they satisfy the axioms.
      ],
      [
        Given $X$, suppose $cal(C) subset cal(P) (X)$ is a collection of subsets that satisfy the following.
        #enum(
          numbering: "a)",
          indent: 1em,
          [
            $emptyset in cal(C) , #h(0.5em) X in cal(C)$.
          ],
          [
            $cal(C)$ is closed under arbitrary intersections.
          ],
          [
            $cal(C)$ is closed under finite unions.
          ],
        )
        Define the collection,
        $
          cal(T) := { U subset X | X without U in cal(C) } .
        $
        Prove that $cal(T)$ is a topology on $X$.
      ],

      [
        On any set $X$, consider the following collections of subsets.
        #enum(
          numbering: "a)",
          indent: 1em,
          [
            $cal(T)_1 := { A subset X | X without A "is finite" } union { emptyset } .$
          ],
          [
            $cal(T)_2 := { A subset X | X without A "is countable" } union { emptyset } .$
          ],
        )
        Show that $cal(T)_1$ and $cal(T)_2$ are topologies on $X$, respectively called the #focus[cofinite] and the #focus[cocountable] topologies.
        
        Now, suppose $X$ is uncountable (say, $X = bb(R)$), and consider the collection
        $
          cal(T)_3 := { A subset X | X without A "is uncountable" } .
        $
        Is $cal(T)_3$ a topology on $X$?
      ],

      [
        On the real line $bb(R)$, consider the collection of subsets
        $
          cal(T)_( <- ) := { emptyset , bb(R) } union { (- infinity , a) | a in bb(R) } .
        $
        Show that $cal(T)_( <- )$ is a topology on $bb(R)$.
      ]
      )
]

#prob[
  #enum(
    indent: 1em, numbering: "i)", 
    [
      #text(blue)[*_(Necessary condition for basis)_*] Suppose $(X, cal(T) )$ is a topological space, and consider a basis $cal(B) subset cal(T)$. Then, the following holds.
      #enum(
        numbering: "a)",
        indent: 1em,
        [
          [ *(B1)* ] For any $x in X$, there exists some $U in cal(B)$ such that $x in U$.
        ],
        [
          [ *(B2)* ] For any $U, V in cal(B)$ and any element $x in U inter V$, there exists some $W in cal(B)$ such that $x in W subset U inter V$.
        ],
      )
    ],

    [
      Suppose $cal(B) subset cal(P) (X)$ is a collection of subsets of $X$ satisfying (B1) and (B2). Consider $cal(T)$ to be the collection of all possible unions of elements of $cal(B)$. Show that $cal(T)$ is a topology on $X$ and $cal(B)$ is a basis for it.
    ]
  )
]

#prob[
  #enum(indent: 1em, numbering: "i)",
    [
      Suppose $U subset X$ is an open set. What are the open subsets of $U$ in the subspace topology? What are the closed sets?
    ],

    [
      Suppose $RR$ is equipped with the Euclidean topology (that is topology genrated by the open intervals). Consider $QQ$ with the subspace topology. 
      - Is the set $(0, sqrt(2)) sect QQ  $ open or closed in $QQ$?
      - Is the set $(0, 3] sect QQ$ open or closed in $QQ$?
    ]
  )
]

#prob[
  #enum(
    indent: 1em, numbering: "i)",
    [
      Show that $f : X -> Y$ is continuous if and only if preimage of closed sets of $Y$ is closed in $X$.
    ],

    [
      Suppose $(X, cal(T) )$ is a topological space. Show that the following are equivalent.
      #enum(
        numbering: "a)",
        indent: 1em,
        [
          $X$ has the discrete topology, i.e., $cal(T) = cal(P) (X)$.
        ],
        [
          Given any space $Y$, any function $f : X -> Y$ is continuous.
        ],
        [
          The map $"Id": (X, cal(T) ) -> (X, cal(P) (X))$ is continuous.
        ],
      )
    ],

    [
      Suppose $(X, cal(T) )$ is a space, and some $A subset X$ is equipped with the subspace topology $cal(T)_A$.
      #enum(
        numbering: "a)",
        indent: 1em,
        [
          Show that the inclusion map $iota : A arrow.r.hook X$ is continuous.
        ],
        [
          Suppose $cal(S)$ is some topology on $A$ such that the inclusion map $iota : (A, cal(S) ) arrow.r.hook (X, cal(T) )$ is continuous. Show that $cal(S)$ is finer than $cal(T)_A$.
        ],
      )
    ]
  )
]