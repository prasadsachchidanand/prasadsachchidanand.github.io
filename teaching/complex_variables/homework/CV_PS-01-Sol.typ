#import "template.typ": *
#let title = "Solution to Homework #1"
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


#soln[
  + Addition on $bb(C)$ is commutative. Let $z_1 = x_1 + iota y_1$ and $z_2 = x_2 + iota y_2$. Then 
    $
      z_1 + z_2 & = (x_1 + iota y_1) + (x_2 + iota y_2) \
                & = (x_1 + x_2) + iota (y_1 + y_2) \
                & = (x_2 + x_1) + iota (y_2 + y_1) quad "commutativity of " bb(R) \
                & = (x_2 + iota y_2) + iota (x_1 + iota y_1) \
                & = z_2 + z_1. 
    $
    Similarly, one can show that the product is commutative (by using the commutativity of product in $bb(R)$.)

  + Again, we will only discuss the associativity of addition and the product will be shown similarly. Let $z_k = x_k + iota y_k$, for $k = 1,2, 3$. 
  $
    (z_1 + z_2) + z_3 & = (x_1 + iota y_1 + x_2 + iota y_2) + x_3 + iota y_3 \
    & = (x_1 + x_2) + iota (y_1 + y_2) + x_3 + iota y_3 \
    & = (x_1 + x_2) + x_3 + iota (y_1 + y_2) + iota y_3 \
    & = x_1 + (x_2 + x_3) + iota y_1 + iota (y_2 + y_3) \
    & = x_1 + iota y_1 + (x_2 + iota y_2 + x_3 + iota y_3) \
    & = z_1 + (z_2 + z_3).
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

#soln[
  + $1/(3 + 4 iota)$. We can write, 
    $
      1/(3 + 4 iota) times (3-4iota)/(3 - 4iota) & = (3 - 4iota)/(3^2 + 4^2) = 3/25 - iota 4/25.
    $
    Thus, $a = 3/25$ and $b = -4/25$.
    #line(length: 100%,stroke: 0.5pt + gray)

  + $(3 + 5 iota)/(2 - 7 iota)$. Consider 
    $
      (3 + 5 iota)/(2 - 7 iota) times (2 + 7 iota)/(2 + 7 iota) = (6 + 21 iota + 10 iota - 35)/(2^2 + 7^2) = (-29)/53 + iota (31)/(53).
    $
    Thus, $a = -29/53$ and $b = 31/53$.
    #line(length: 100%,stroke: 0.5pt + gray)

  + $1/iota$. 
    $
      1/iota = 1/iota times iota/iota = iota/(-1) = -iota.
    $
    Thus, $a = 0$ and $b = -1$.
    #line(length: 100%,stroke: 0.5pt + gray)

  + $1/(x + iota y)$. 
    $
      1/(x + iota y) times (x - iota y)/(x - iota y) = x/(x^2 + y^2) + iota y/(x^2 + y^2) = x/7 + iota y/7.
    $
    Thus, $a = x/7$ and $b = y/7$.
    #line(length: 100%,stroke: 0.5pt + gray)

  + $(1 + iota)^5$. Note that
    $
      (1 + iota)^2 = 1 + iota^2 + 2 iota = 1 - 1 + 2iota = 2iota.
    $
    Thus,
    $
      (1 + iota)^5 & = (1+iota)^2 dot (1 + iota)^2 dot (1 + iota) \
                   & = 2iota dot 2 iota dot (1 + iota) \
                   & = -4 (1 + iota) \
                   & = -4 - 4 iota.
    $
    Thus, $a = -4$ and $b = -4$.
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

#soln[
  + We want to find $(z_1 + z_2 dot z_3)/(z_4)$. Note that 
    $
      z_2 dot z_3 = 3iota dot (3 - 4 iota) = 9iota - 12 iota^2 = 9iota  + 12.
    $
    Also, 
    $
      1/(z_4) = 1/(1 - iota) = 1/(1 - iota) times (1 + iota)/(1 + iota) = (1 + iota)/2.
    $
    Thus, 
    $
      (z_1 + z_2 dot z_3)/(z_4) & = (z_1 + z_2 dot z_3) dot 1/(z_4) \
                                & = ((2 + 3iota) + (12 + 9 iota)) dot (1 + iota)/2 \
                                & = (14 + 12 iota) dot (1+ iota)/2 \
                                & = (7 + 6iota) (1 + iota) \
                                & = 1 + 13 iota
    $
    #line(length: 100%,stroke: 0.5pt + gray)

  + We want to find $z_1 dot z_2 dot z_3 dot z_4$. In the previous probelm we have already found $z_3 dot z_3$. So, 
    $
      z_1 dot (z_2 dot z_3) dot z_4 & = (2 + 3 iota) dot (12 + 9 iota) dot (1 - iota) \
      & = (2 + 3iota) dot (21 - 3iota) \
      & = 51 + 57 iota. 
    $
    #line(length: 100%,stroke: 0.5pt + gray)

  + We want to simplify $z_1 / z_2 / z_3 - z_4$. At first consider 
    $
      z_1 / z_2 & = (2 + 3 iota) / (3 iota) = 2/(3 iota) + 1 = -2/3 iota + 1 .
    $
    Similarly, 
    $
      z_1 / z_2 / z_3 & = (-2/3 iota + 1)/(3 - 4 iota) = (1 -2/3 iota)/(3 - 4 iota) times (3 + 4iota)/(3 + 4iota) = 1/25 (17/3 + 2 iota).
    $
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

#soln[
  #figure(
    image("../img/complexPlaneSolution.svg", width: 80%),
  )
]

#pagebreak()
#prob[
  Geometrically demonstrate the following. 

  - Sum of two complex numbers. 

  - Product of complex numbers. 
]

#soln[
  - Sum of two complex numbers $z_1$ and $z_2$.
    #figure(
      image("../img/sumOfTwoComplexNumbers.svg", width: 80%),
      caption: [
        Sum of $z_1$ and $z_2$
      ]
    )
    #line(length: 100%,stroke: 0.5pt + gray)
]

#prob[
  We want to understand the geometric meaning of difference of two complex numbers. Answer the following steps to understand the geometric meaning of difference of two complex numbers, say $z_1 - z_2$. 

  - Draw the complex number $z_1$ and $z_2$. It is an arbitrary choice, your drawing maybe different from your friends' drawing. 

  - Draw the complex number $-z_2$.

  - Use the previous problem to draw the complex number $z_1 + (-z_2)$. 
]