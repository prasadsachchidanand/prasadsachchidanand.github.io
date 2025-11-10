#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #11"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "manifolds"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
1. Let 
$
  bb(S)^n = {(x_0, x_1, dots, x_n): sum_(i=0)^n x_i^2 = 1} subset bb(R)^(n+1)
$
be $n$-sphere. Let $N= (0,0,dots, 1)$ and $S = (0,0,dots, -1)$. Show that in the stereographic projection the maps are 
$
  phi : bb(S)^n - {N} -> bb(R)^n, quad (x_0, x_1, dots, x_n) mapsto (x_0/(1-x_n),x_1/(1-x_n), dots, x_(n-1)/(1 - x_n) ) 
$
and if $bf(y) = (y_1, y_2, dots, y_n)$, then 
$
  phi^(-1) : bb(R)^n -> bb(S)^n, quad (y_1, y_2, dots, y_n) mapsto 2/(norm(bf(y))^2 + 1) (y_1, y_2, dots, norm(bf(y))^2 - 1).
$
Also, the maps from $bb(S)^n - {S}$ is $psi(bf(x)) = - psi(-bf(x))$.

2. Show that the maps are smooth. 

3. Compute the transition map $psi compose phi^(-1)$ and verify that the atlas consisting of the two charts $(bb(S)^n - {N}, phi)$ and $(bb(S)^n - {S}, psi)$ defines a smooth structure on $bb(S)^n$. 
]

#prob[
  In this problem we will use the _regular value theorem_ to prove that $bb(S)^n$ is an $n$-dimensional manifold. Recall that for a smooth function $f : bb(R)^m to bb(R)^n$, we say that $a in RR^m$ is a _regular point_ if $d f_a$ is of full rank (that is, the rank of $d f_a$ is $n$). The image $f(a)$ is called the _regular value_.

  Consider the function 
  $
    f : bb(R)^(n+1) to bb(R) , quad (x_0, x_1, dots, x_n) mapsto sum_(i = 0)^(n+1) x_i^2.
  $

  + Show that $f$ is smooth. 

  + Show that $1$ is a regular value of $f$.

  + Hence, conclude that $bb(S)^n$ is a smooth manifold of dimension $n$.  
]

#prob[
  If $M$ is a manifold of dimension $n$, then prove that any open subset $U subset M$ is also an $n$-dimensional manifold.   
]

#prob[
  Prove that the cone 
  $
    C := {(x,y,z) in bb(R)^3 : z = sqrt(x^2 + y^2)} subset bb(R)^3
  $ 
  is not a manifold. 
]

#prob[
  Let $M_1 subset bb(R)^(d_1)$ and $M_2 subset bb(R)^(d_2)$ be two manifolds whose dimensions are $m_1$ and $m_2$, respectively. Prove that the product space 
  $
    M_1 times M_2 = {(p_1,p_2): p_1 in M_1, p_2 in M_2} subset RR^(d_1 + d_2)
  $    
  is a manifold of dimension $m_1 + m_2$. 
]