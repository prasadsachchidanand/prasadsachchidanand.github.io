#import "template.typ": *
#import "@preview/commute:0.3.0": node, arr, commutative-diagram
#let title = "Homework #5"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "matrices over other fields"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)


#prob[
  (i) Let $p$ be a prime. Prove that if $p divides a b$, then $p$ divides either $a$ or $b$.   

  (ii) In a field $bb(F)$, prove that if $a b = 0$, then either $a = 0$ or $b = 0$.
]

#prob[
  Let 
  $
    U(n) = {A in G L_n (bb(C)) : A A^* = I_n = A^* A },
  $
  where $A^*$ is the conjugate transpose. For example, 
  $
    A = mat(2+iota, 1; 1 - iota, 2 iota), "then " A^* = mat(2 - iota, 1 + iota; 1, -2 iota).
  $

  This is called _unitary group_ (analogus to set of orthogonal group). Similarly, we have _special unitary group_ which is 
  $
    S U(n) = {A in U(n): det A = 1}.
  $

  (i) Can you identify the groups $U(1)$ and $S U(1)$?

  (ii) Prove that $S U(2) = {mat(a, b; -overline(b), overline(a)): a,b in bb(C) " and " abs(a)^2 + abs(b)^2 = 1}$. 

  (iii) Show that $S U(2) \/{plus.minus I} tilde.equiv S O(3)$.
]

// #prob[
//   Show that $S O(3) $ is a normal subgroup of $O(3)$ and identify the quotient group $O(3) / S O(3)$. 
// ]

#prob[
  Determine the groups $G L_1 (bb(C)), S L_1 (bb(C)), O_1 (bb(C)) "and" S O_1 (bb(C))$.
]

#prob[
  This problem involve calculations for matrix group over $bb(Z)_p$.
  
  (i) How many elements are there in the group $G L_2 (bb(Z)_3)$? 
  
  (ii) How many are there in $S L_2 (bb(Z)_3)$?

  (iii) Find the inverse of the matrix $mat(2, 2; 1, 2)$ in $G L_2 (bb(Z)_7)$. 
]

#prob[
  We want to define an injective homomorphism $phi_n : M_n (bb(C)) ->M_(2n)(bb(R))$. Given any $A in M_n (bb(C))$, we have a corresponding linear map $L_A: bb(C)^n -> bb(C)^n$. Also, we have a canonical map $f_n: bb(C)^n -> bb(R)^(2n),$ $(a+iota b_1, dots, a_n+ iota b_n) mapsto (a_1, b_1, dots, a_n, b_n)$.  

  Given $A in M_n (bb(C))$, we need to determine $B = phi_n (A) in M_(2n)(bb(R))$, equivalently, we need to find a linear map $L_(phi_n (A)): bb(R)^(2n) -> bb(R)^(2n)$ so that the following diagram commutes.  
  #align(center, commutative-diagram(
    node((0, 0), [$bb(C)^n$]),
    node((1, 0), [$bb(C)^n$]),
    node((1, 2), [$bb(R)^(2n)$]),
    node((0, 2), [$bb(R)^(2n)$]),
    arr((0, 0), (1, 0), [$L_A$], label-pos: right),
    arr((1, 0), (1, 2), [$f_n$ ]),
    arr((0, 0), (0, 2), [$f_n$ ]),
    arr((0, 2), (1, 2), [$L_(phi_n (A))$]),
  ))
   That is, $f_n compose L_A = L_(phi_n (A)) compose f_n$.

   Consider 
   $
    phi_1 : M_1 (bb(C)) -> M_2 (bb(R)), quad a + iota b mapsto  mat(a, -b; b, a).
   $
   Show that with this definition of $phi_1$ the above diagram is commutative. 
]

