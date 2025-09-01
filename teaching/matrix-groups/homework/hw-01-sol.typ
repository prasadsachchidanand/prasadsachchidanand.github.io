#import "template.typ": *
#let title = "Homework 1 Solution"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "review of linear algebra"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Let $T$ be a linear transformation from $V$ to $W$. Show that $T(bold(0)) = 0$.
]

#soln[
  Given that $T: V -> W$ is a linear transformation. 
  $
    0 = T(bold(0)) = T(bold(0) + bold(0)) = T(bold(0)) + T(bold(0)) => T(bold(0)) = 0.
  $
]

#prob[
  Describe geometrically the action of $T$ on the square whose vertices are at $(0,0), (1,0), (1,1)$ and $(0,1)$.

  + $T mat(x;y) = mat(-x;y)$

  + $T mat(x;y) = mat(y;x)$ 

  + $T mat(x;y) = mat(2x; y)$

  + $T mat(x;y) = mat(x+y; y)$
]

#soln[
  1. Reflection about $x$-axis. 
  #figure(
    image("../img/reflection-x-axis.svg", width: 50%),
    caption: [
      Reflection about the $x$-axis
    ],
  )

  2. Reflection about the line $y = x$. 
  #figure(
    image("../img/reflection-y=x-line.svg", width: 50%),
    caption: [
      Reflection about the $y=x$-line
    ],
  )

  3. Stretch the square to the right by $2$-times.
  #figure(
    image("../img/stretch-x-part.svg", width: 50%),
    caption: [
      stretching the square. 
    ],
  )
]


#prob[
  Let $T: bb(R)^3 -> bb(R)^4$ be the linear transformation defined by 
  $
    T mat(x;y;z) = mat(x + y; 3x - z; 2y - 3z; 4x + 2y + z).
  $
  Find the matrix of $T$ with respect to the standard bases. Also find the matrix of $T$ with respect to the bases 
  $
    {e_1 + e_2, e_1 - e_2, e_3} "and" {e_1, e_2, e_3, e_4}.
  $
]

#soln[
  
]