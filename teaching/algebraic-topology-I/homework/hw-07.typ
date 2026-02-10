#import "template.typ": *
#let title = "Homework #7"
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
  Show that if $f_0, f_1: X to Y$ are homotpic, then for any $g: Y to Z$, the maps $g compose f_0 "and" $ $g compose f_1$ are homotopic.
]

#prob[
  Let $(X, x_0)$ be a pointed space. For a loop $alpha$ based at $x_0$, let $[alpha]$ denote the homotopy class of $alpha$, where homotopies are taken relative to the basepoint $x_0$. Define
  $
    pi_1(X, x_0) = {[alpha] : alpha "is a loop based at" x_0}.
  $
  
  In the lectures, we have seen pictorially the operation on $pi_1(X, x_0)$ given by concatenation of loops. In this problem, you are asked to prove these properties formally and give explicit homotopies.
  
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Show that for loops $alpha$ and $beta$ based at $x_0$, the operation
      $
        [alpha] * [beta] = [alpha * beta]
      $
      is well defined.
    ],
    [
      Show that there exists $[e] in pi_1(X, x_0)$ such that for any loop $alpha$ based at $x_0$,
      $
        [alpha] * [e] = [alpha] = [e] * [alpha].
      $
    ],
    [
      Show that for any loop $alpha$ based at $x_0$, there exists a loop $beta$ based at $x_0$ such that
      $
        [alpha] * [beta] = [e] = [beta] * [alpha].
      $
    ],
    [
      Show that for any loops $alpha, beta, gamma$ based at $x_0$,
      $
        ([alpha] * [beta]) * [gamma]
        =
        [alpha] * ([beta] * [gamma]).
      $
    ],
  )   
]

#prob[
  Recall that given space $X$ and $Y$, the set $[X,Y]$ denote the set of all homotopy classes of maps of $X$ into $Y$. 
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Let $II = [0,1]$, Show that for any space $X$, the set $[X, II]$ is singleton.
    ],
    [
      Show that if $Y$ is path connected, then the set $[II, Y]$ is singleton.
    ],
    [
      Show that if $Y$ is contractible, then for any $X$, the set $[X, Y]$ is singleton.
    ],
    [
      Show that a contractible space is path connected.
    ],
    [
      Show that if $X$ is contractible, then $pi_1(X, x_0)$ is the trivial group.
    ],
    [
      Show that if $X$ is contractible and $Y$ is path connected, then the set $[X, Y]$ is singleton.
    ]
  )  
]

#prob[
  If $X$ is path connected, then show that $pi_1(X, x_0)$ is isomorphic to $pi_1(X, x_1)$.     
]

#prob[
  Let $alpha$ be a loop based at $x_0$. Show that if $alpha$ is null-homotopic,
  then for any loop $beta$ based at $x_0$ we have
  $
    [alpha] * [beta] = [beta] = [beta] * [alpha].
  $
]

#prob[
  Use the standard homeomorphism 
  $
    h: [a,b] to [0,1], quad mapsto (s-a)/(s-b)
  $
  to show that 
  $
    f: [0,1] to [0,1], quad s mapsto 
    cases(
      2s\, quad s in [0,1/4] ,
      s + 1/4\, quad s in [1/4, 1/2],
      (s+1)/2\, quad s in [1/2, 1]
    )
  $
  is homotopic to the identity on $[0,1]$.
]

#prob[
  Consider the identity map, $1_(SS^1) : SS^1 to SS^1$, as a closed curve on the torus $SS^1 times SS^1$ in @fig:loop-on-torus and find explicity two other closed curves on the torus such that all three belongs to different homotopy classes. 
  #figure(
    image("../img/curve-on-torus.svg", width: 30%),
    caption: [Loop on the torus]
  )<fig:loop-on-torus>
]

#prob[
  Show that the following $X, Y$  are homotpically equivalent spaces. Are they homeomorphic?
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      $X = SS^n, Y = SS^n times RR^m$; 
    ],
    [
      $X = RR^n, Y = {0}$; 
    ],
    [
      $X = SS^(n-1), Y = RR^n\\{0}$; 
    ],
    [
      $X = SS^1 or SS^1, Y = "punctured torus"$; 
    ],
    [
      $X = SS^1, Y = "punctured" RR PP^2$.
    ]
  )
]

#prob[
  Show that a circle $SS^1$, a cylinder $SS^1 times [0,1]$ and a solid torus $SS^1 times DD^2$ are mutually homotopic.    
]

#prob[
  Show that if $f: X to SS^n$ is not surjective, then $f$ is nullhomotopic. Give an example of a space $X$ and a surjective  map $f: X to SS^n$ such that $f$ is not null homotopic.   
]