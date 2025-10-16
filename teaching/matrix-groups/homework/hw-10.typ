#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #10"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "multivariable calculus"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Let $f: RR^2 -> RR$ be a function defined by $f(x,y) = sqrt(abs(x y))$. Show that $f$ is not differentiable at $(0,0)$.  
]

#prob[
  Let $f: RR^n to RR$ be a function such that $abs(f(bf(x))) <= norm(bf(x))^2$. Show that $f$ is differentiable at $bf(x) = bf(0)$. 
]

#prob[
  Find $f'$ for the following functions: 

  + $f(x,y) = sin(x y)$

  + $f(x,y,z) = (x^y, z)$

  + $f(x,y,z) = x^y$

  + $f(x,y,z) = x^y^z$ 

  + $f(x,y) = integral _a ^(x+y) g(t) "d"t$, where $g: RR to RR$ is a continuous function.       
]

#prob[
  Show (by an example) that the existence of all partial derivatives of a function does not imply differentiability of the function. 
]

#prob[
  Let $U subset RR^n$ be an open set and $f: U to RR^n$ a continuously differentiable $1$-$1$ function  such that $det d f_(bf(x)) !=0$ for all $bf(x)$. Show that $f(U)$ is an open set and $f^(-1) : f(U) to U$ is differentiable. Show also that $f$ is an open map, that is, for any open set $V subset RR^n$ $f(V)$ is open.       
]

#prob[
  Let $f: RR^2 to RR$ be a continuously differentiable function. Show that $f$ is not $1$-$1$.

  Generalize this result in the case of a continuously differentiable function $f: RR^n to RR^m$ for $m < n$.    
]

#prob[
  + If $f: RR to RR$ be a function such that $f'(a) != 0$ for all $a in RR$, then show that $f$ is $1$-$1$. 

  + Define 
  $
    f: RR^2 to RR^2, quad (x,y) = (e^x cos y, e^x sin y).
  $     
  Show that $det d f_(x,y) != 0$ for all $(x,y) in RR^2$ but $f$ is not $1$-$1$.    
]