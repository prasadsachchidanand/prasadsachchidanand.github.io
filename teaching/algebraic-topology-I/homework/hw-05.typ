#import "template.typ": *
#let title = "Homework #5"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "paths and path connectedness"
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
  Let $X$ be a topological space. Define a relation $~$ on $X$ by
  $
    x ~ y iff exists "a path " gamma: x to y.
  $
  Show that $~$ is an equivalence relation on $X$. 
]

#prob[
  Let $X$ be a topological space. Recall that $pi_0 (X)$ denotes the colelction of path components of $X$ (that is, the collection of equivalnece classes from Problem 1). The following are equivalent:
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      $X$ is path connected.
    ],
    [
      $pi_0(X)$ is singleton.
    ],
    [
      Any continuous function $f: {0,1} to X$ ha a continuous extension $F: [0,1] to X$.
    ],
  )
]

#prob[
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      For $n> 1$, $RR$ is not homeomorphic to $RR^n$.
    ],
    [
      The space $RR times {0} cup {0} times RR$ is not homeomorphic to $RR$ or $RR^2$.
    ],
  )
]

#prob[
   Show that the concatenation of paths is not associative. That is, if $alpha_[0,1]: x to y, beta_[0,1]: y to z$ and $gamma_[0,1]: z to w$, then it is not necessary that
   $
     (alpha * beta)* gamma = alpha * (beta * gamma).
   $
]

