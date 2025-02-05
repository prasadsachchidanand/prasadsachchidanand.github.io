#import "template.typ": *
#let title = "Homework #2"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Complex Variables"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "polar representation of complex number"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Represent the following complex number in the polar form. Let me show an example that you need to do. For example, consider the complex number $z = 1 + sqrt(3) iota$. Here 
  $
    r & = sqrt(1^2 + sqrt(3)^2) = sqrt(4) = 2 \
    arg(z) & = tan^(-1)(1/sqrt(3)) = pi/6 + 2n pi, quad n in bb(Z)\
    text("Arg")(z) & = tan^(-1)(1/sqrt(3)) = pi/6. 
  $
  The polar form of $z$ will be 
  $
    z = 2 (cos(pi/6) + iota sin(pi/6)).
  $
  Note that one can also write the polar form as 
  $
    z = 2 (cos ((13pi)/6) + iota sin ((13pi)/6)).
  $
  When we write the polar form, it is not necessary to write the principal argument. 


  + $-4 + 4 iota$

  + $-5$

  + $12/(sqrt(3) + iota)$

  + $1 - iota$

  + $2 iota$, $-2 iota$

  + $-2 - 2 sqrt(3) iota$
]

#prob[
  In the following problems, write the complex number in the form of $a + iota b$. 

  + $z = 10 (cos pi/3 + iota sin pi/3)$

  + $z = 5 (cos (7pi)/6 + iota sin (7pi)/6)$

  + $z = 8 sqrt(2) (cos (11pi/4) + iota sin(11 pi)/4)$
]

#prob[
  In the following problems find $z_1 z_2$ and $z_1/z_2$. 

  + $z_1 = 2 (cos pi/8 + iota sin pi/8)$ and $z_2 = 4 (cos (3 pi)/8 + iota sin (3 pi)/8)$

  + $z_1 = sqrt(2) (cos pi/4 + iota sin pi/4)$ and $z_2 = sqrt(3) (cos pi/12 + iota sin pi/12)$
]

#prob[
  Determine the argument and principal argument of the following complex numbers.

  + $z = -1 - iota$

  + $iota/(-2 - 2 iota)$

  + $(sqrt(3) - iota)^6$

  + $(sqrt(3) + iota)^7$
]


#prob[
  Simplify
  $
    ((cos 3theta + iota sin 3theta)^4(cos 4theta - iota sin 4theta)^5)/((cos 4theta + iota sin 4theta)^3 (cos 5theta + iota sin 5theta)^(-5)).
  $
]

#prob[
  Show that 
  $
    (1 + cos theta + iota sin theta)^n +(1 + cos theta - iota sin theta)^n = 2^(n+1) cos^n (theta/2) dot (cos (n theta)/2).
  $
]

#prob[
  Find the four fourth roots of $z = 1 + iota$.
]

#prob[
  In the following problems compute all roots. 

  + $(8)^(1 / 3)$

  + $(-iota)^(1/3)$

  + $(3 + 4 iota)^(1/2)$

  + $((16 iota)/(1 + iota))^(1/8)$

  + $((1 + iota)/(sqrt(3) + iota))^(1/6)$
]

#prob[
  Find all solutions of $z^4 + 1 = 0$.
]