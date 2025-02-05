#import "template.typ": *
#let title = "Homework #1"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Complex Variables"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "algebra of complex numbers"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Let $bb(C)$ denotes the set of all complex numbers. Then show the following. 

  1. Addition and product operations on $bb(C)$ are commutative. That is, for any $z_1, z_2 in bb(C)$, we have 
  $
    z_1 + z_2 = z_2 + z_1 quad text("and") quad z_1 dot z_2 = z_2 dot z_1
  $

  2. Addition and product operations on $bb(C)$ are associative. That is, for any $z_1, z_2, z_3 in bb(C)$, we have 
  $
    (z_1 + z_2) + z_3 = z_1 + (z_2 + z_3) quad text("and") quad (z_1 dot z_2)dot z_3 = z_1 dot (z_2 dot z_3)
  $
]

#prob[
  Represent the following complex numbers in the form of $a + iota b$, where $a$ and $b$ are real numbers.

  + $1/(3 + 4 iota)$ 
  
  + $(3+ 5 iota)/( 2 - 7 iota)$
  
  + $1/iota quad$ 
  
  + $1/(x + iota y) ,$ where $x^2 + y^2 = 7$. 

  + $(1 + iota)^5$.
]

#prob[
  Let 
  $
    z_1 = 2 + 3iota, quad z_2 = 3 iota, quad z_3 = 3 - 4iota text("and") z_4 = 1 - iota.
  $
  Simplify the following. 

  + $(z_1 + z_2 dot z_3 )/z_4$.

  + $z_1 dot z_2 dot z_3 dot z_4$.

  + $z_1 / z_2 / z_3 - z_4$.
]

#prob[
  Look at the following figure and write the corresponding complex number. Each grid shows one unit. For example, the complex number corresponding to the point $(2,2)$ will be $2 + 2 iota$.
  #figure(
    image("../img/complexPlane.svg", width: 80%),
    caption: [
      The complex plane 
    ],
  )
]

#prob[
  Geometrically demonstrate the following. 

  - Sum of two complex numbers. 

  - Product of complex numbers. 
]

#prob[
  We want to understand the geometric meaning of difference of two complex numbers. Answer the following steps to understand the geometric meaning of difference of two complex numbers, say $z_1 - z_2$. 

  - Draw the complex number $z_1$ and $z_2$. It is an arbitrary choice, your drawing maybe different from your friends' drawing. 

  - Draw the complex number $-z_2$.

  - Use the previous problem to draw the complex number $z_1 + (-z_2)$. 
]