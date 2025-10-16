#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #9"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "matrix exponential and Lie algebra"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  For all $A, B in M_n (KK)$ with $A in G L_n (KK)$,  show that 
  $
    e^(A B A ^(-1)) = A e^B A^(-1).
  $
]

#prob[
  Prove that for any $A in M_n (KK)$, 
  $
    (e^A)^* = e^(A^*).
  $ 
]

#prob[
  + Let $A = "diag"(a_1, a_2, dots, a_n) in M_n (RR)$. Calculate $e^A$. Using this, give a proof that $det (e^A) = e^("trace"(A))$.

  + A matrix $A$ is said to be _similar_ to $B$ if there exists an invertible matrix $P$ such that $B = P^(-1) A P$. Give a proof that $det (e^A) = e^("trace"(A))$ when $A$ is similar to a diagonal matrix.     
]

#prob[
  Let $A = mat(0, 1; -1, 0)$. Calculate $e^A$.  
]

#prob[
  Find the Lie algebra of the following matrix groups. 
  + $S O(n)$ and $dim S O(n) = n(n-1)/2$. 
  
  + $U(n)$ and $dim U(n) = n^2$. 

  + $S p(n)$  and $dim S p(n) = 2n^2 + n$. 
]

#prob[
  Recall that 
  $
    U T_n (KK) = {A in G L_n (KK): A "is upper triangular"}. 
  $
  Describe the Lie algebra of $U T_n (KK)$. 
]

#prob[
  Prove that the Lie algebra of $O(3)$ is isomorphic (as a vector space) to $RR^3$.
]

#prob[
  Let $G = S U(2)$. Denote 
  $
    sigma_1 = mat(0,1;1,0), quad sigma_2 = mat(0, -iota; iota, 0), quad sigma_3 = mat(1, 0; 0, -1)
  $ 
  and $A_j = iota sigma_j$ for $j = 1, 2,3$.

  + For $j = 1,2,3$, find $exp(t A_j)$ and show that it is in $G$.

  + Explain why part (1) tell you that $A_1, A_2$ and $A_3$ are in the Lie algebra $cal(L)(G)$. 

  + Let $ W = {mat(u iota, v + w iota; - v + w iota, - u iota): u,v,w in RR} $ show that every element of $W$ can be written as a real linear combination of $A_1, A_2$ and $A_3$. 

  + Explain why $cal(L)(G) = W$.   
]

#prob[
  Show that for $G = S U(n)$, the Lie algebra is 
  $
    cal(L)(G) = frak(s u)(n) = {A in M(n, CC): A^* + A = 0 quad "and" quad tr(A) = 0}.
  $
]

#prob[
  For $alpha = mat(0, a; -a, 0), a in RR$, show that $e^alpha in S O(2)$.
]