#import "template.typ": *
#let title = "Homework #6"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "homotopy"
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
  Give the definitions of:
  
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Homotopic maps.
    ],
    [
      A contractible space.
    ],
    [
      Homotopy equivalence between two topological spaces.
    ]
  )
  
  Explain briefly how (ii) is a special case of (iii).
]

#prob[
  Let $X$ be a topological space. Show that any continuous function $f: X to X$ is null homotopic if and only if $X$ is contractible.   
]

#prob[
  Prove that every convex subset of $bb(R)^n$ is contractible.
]

#prob[
  Show that $RR \\ {0}$ is contractible.  
]

#prob[
  Let $X$ be a topological space and $C(X)$ its cone. Prove that $C(X)$ is contractible.
]

#prob[
  Give an example of a space which is:
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      contractible but not path connected,
    ],
    [
      path connected but not contractible.
    ]
  )
]

#prob[
  Let $X$ and $Y$ be topological spaces.
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Prove that if $X$ and $Y$ are contractible, then $X times Y$ is contractible.
    ],
    [
      Is the converse true? Justify your answer with either a proof or a counterexample.
    ]
  )
]

#prob[
  Show that the annulus
  
  $ A = {(x,y) in bb(R)^2 bar.v 1 <= x^2 + y^2 <= 2} $
  
  is homotopy equivalent to $S^1$.
]

#prob[
  Let $X_1 = RR^2 \\ {(0,0)}$ and $X_2 = RR \\ {(0,0), (1,0)}$. Is $X_1$ and $X_2$ are homotopic equivalent?    
]

#prob[
  Define explicitly a homotopy equivalence between the following two subspaces of $RR^2$. 
  $
    X & = S^1 cup ({0} times [-1,1]) \
    Y & = (S^1 + (-2,0)) cup ([-1,1] times {0}) cup (S^1 + (2,0)).
  $ 
  #figure(
    image("../img/homotopy-problem-1.svg", width: 70%)

  )
]