#import "template.typ": *
#let title = "Homework #9"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "covering space"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)
#show math.equation.where(block: true): eq => {
  block(width: 100%, inset: 0pt, align(center, eq))
}

#prob[
  Show that the map
  $
    p: RR to SS^1, quad x mapsto e^(2 pi iota x)
  $ 
  is a covering map by choosing the covers as follows. 
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Choose the covers as 
      $
        U_1 & = {(cos 2pi x, sin 2pi x): cos 2pi x > 0  }, \
        U_2 & = {(cos 2pi x, sin 2pi x): cos 2pi x < 0  }, \
        U_3 & = {(cos 2pi x, sin 2pi x): sin 2pi x > 0  }, \
        U_4 & = {(cos 2pi x, sin 2pi x): sin 2pi x < 0  }.
      $
      #v(1em)
      #figure(
        image("../img/circle_cover-1.svg")
      ) 
      #v(1em)
    ],

    [
      Chose the covers as 
      $
        U_1 & = SS^1 -{(1,0)} quad "and" quad U_2 = SS^1 - {(-1,0)}.
      $
      #v(1em)
      #figure(
        image("../img/circle_cover-2.svg", width: 60%),
      )
      #v(1em)
    ],
    [
      Chose the covers as 
      $
        U_1 & = SS^1 - {bf(x)} quad "and" quad U_2 = SS^1 - {-bf(x)},
      $
      where $bf(x) = (cos 2 pi t_0, sin 2pi t_0)$ for some $t_0 in RR$. 
    ]
  )
]

#prob[
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Show that the map $p: RR_(>0) to SS^1$ given by $p(x) = (cos 2pi x, sin 2pi x)$ is *not* a covering map.  
    ],
    [
      Consider the restriction map $p: (-2,2) to SS^1$. Show that it is *not* a covering map.  
    ]
  )
]

#prob[
  Show that covering maps are open. 
]

#prob[
  Show that the map $p: SS^1 to SS^1$ given by $p(z) = z^2$ is a covering map. Generalize this to show that $p(z) = z^n$ is a covering map.  
]

#prob[
  Let $p: tilde(X) to X$ be a covering map. Show that if $X$ is Hausdorff, then $tilde(X) $ is also Hausdorff. Furthermore, if $p$ is finite-to-one, that is, $p^(-1)(x)$ is finite for any $x in X$, then show that if $tilde(X)$ is Hausdorff then $X$ is Hausdorff.  
]

#prob[
  Let $Y$ have the discrete topology. Show that if $p: X times X to X$ is projection on the first coordinate, then $p$ is a covering map.    
]

#prob[
  Let $p: E to B$ be continuous and surjective. Suppose that $U$ is an open set of $B$ that is evenly covered by $p$. Show that if $U$ is connected, then the partition of $p^(-1)(U)$ into slices is unique.       
]

#prob[
  Let $p: E to B$ be a covering map and $B$ be connected space. Show that if $p^(-1)(b_0)$ has $k$ elements for some $b_0 in B$, then $p^(-1)(b)$ has $k$ elements for every $b in B$. In such a case, $E$ is called a #focus[$k$-fold covering] of $B$. 
]

#prob[
  Let $p_1: E_1 to B_1$ and $p_2 : E_2 to B_2$ be two covering maps. Show that 
  $
    p_1 times p_2: E_1 times E_2 to B_1 times B_2
  $  
  is a covering map. Use this to find a cover of $SS^1 times SS^1$ and $SS^1 times RR$.  
]

#prob[
  For now let us assume that $SS^2$ is simply connected. Construct a simply connected covering space of the space $X subset.eq RR^3$ that is the union of a sphere and a diameter. 
   #v(1em)
   #figure(
     image("../img/cover-sphere_with-diameter.svg", width: 30%),
   )
]
