
#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #7"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "matrices over other fields cont."
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  In this problem set we will describe the isomorphism between the quotient $S U(2)\/{plus.minus I} tilde.equiv S O (3)$ which was a problem in the previous homework (Homework 5, Problem 2 (iii)).
  
  (i) The $n$-sphere is defined as
  $
    S^n = { (x_0,dots,x_(n)) in bb(R)^(n+1) : x_0^2 + x_1^2 + dots + x_n^2 = 1 }.
  $
  Show that
  $
    S^3 = {(w, x, y, z)in bb(R)^4: w^2+x^2+y^2+z^2 = 1 }
  $
  can be identified with the set of unit quaternions
  $
    {q = w + x i + y j + z k in bb(H) w^2 + x^2 + y^2 + z^2 = 1}.
  $
  Prove that $S^3$ is a subgroup of the multiplicative group of nonzero quaternions $bb(H)^(times)$.
  
  (ii) In Homework 5, Problem 2 (ii) we proved that
  $
    S U(2) = {mat(a, b; -overline(b), overline(a)): abs(a)^2 + abs(b)^2 = 1}.
  $
  Show that $S U(2) tilde.equiv S^3$ as a group.
  
  (iii) Let $op("Im") bb(H) = \{ x i+y j+z k : x,y,z in bb(R) \}$ be the set of pure quaternions, which we identify with $bb(R)^3$.
  
  For $q in S^3$ and $v in op("Im") bb(H)$, define
  $ T_q (v) = q v q^(-1). $
  
  (a) Show that $T_q (v)$ is again a pure quaternion.
  
  (b) Prove that $T_q$ is $bb(R)$-linear.
  
  (c) Show that $|T_q (v)| = |v|$. Conclude that $T_q$ is an orthogonal linear transformation of $bb(R)^3$, i.e. $T_q in O(3)$.
  
  (iv) Prove that $det(T_q) = 1$ for all $q in S^3$. Conclude that $T_q in S O(3).$
  
  (v) Thus we obtain a homomorphism
  $
    Psi: S U(2) tilde.equiv S^3 -> S O(3), q mapsto T_q.
  $
  Show that the kernel is ${plus.minus I}$ and hence conclude that $S U(2)\/{plus.minus I} tilde.equiv S O(3)$.
]

In this problem set we will describe the isomorphism between the quotient
$ S U(2) \/ \{plus.minus I\} quad "and" quad S O(3). $
We will proceed step by step, starting with quaternions and unitary matrices.

#prob[
  (a) The $n$-sphere is defined as
  $ S^n = \{ (x_1, dots, x_(n+1)) in bb(R)^(n+1) : x_1^2 + dots.c + x_(n+1)^2 = 1 \}. $
  
  Show that
  $ S^3 = \{ (w,x,y,z) in bb(R)^4 : w^2+x^2+y^2+z^2 = 1 \} $
  can be identified with the set of unit quaternions
  $ q = w + x i + y j + z k, quad w^2+x^2+y^2+z^2=1. $
  
  (b) Prove that $S^3$ is a subgroup of the multiplicative group of quaternions $bb(H)^times$.
]

#prob[
  In Homework 4 (Problem 3) we proved that
  $ S U(2) = \{mat(alpha, beta; -overline(beta), overline(alpha)) : alpha,beta in bb(C), |alpha|^2+|beta|^2=1\}. $
  
  (a) Show that if $alpha=a+b i$ and $beta=c+d i$ with $a,b,c,d in bb(R)$, then the above matrix can be associated with the quaternion
  $ q = a + b i + c j + d k in S^3. $
  
  (b) Verify that matrix multiplication in $S U(2)$ corresponds exactly to quaternion multiplication under this identification. Conclude that
  $ S U(2) tilde.equiv S^3 $
  as groups.
]

#prob[
  Let $op("Im") bb(H) = \{ x i+y j+z k : x,y,z in bb(R) \}$ be the set of pure quaternions, which we identify with $bb(R)^3$.
  
  For $q in S^3$ and $v in op("Im") bb(H)$, define
  $ T_q (v) = q v q^(-1). $
  
  (a) Show that $T_q (v)$ is again a pure quaternion.
  
  (b) Prove that $T_q$ is $bb(R)$-linear.
  
  (c) Show that $|T_q (v)| = |v|$. Conclude that $T_q$ is an orthogonal linear transformation of $bb(R)^3$, i.e. $T_q in O(3)$.
]

#prob[
  Prove that $det(T_q) = 1$ for all $q in S^3$. Conclude that
  $ T_q in S O(3). $
]

#prob[
  Let
  $ q = w + x i + y j + z k in S^3. $
  By computing $T_q (e_1), T_q (e_2), T_q (e_3)$ (where $e_1=i, e_2=j, e_3=k$), show that the associated $3 times 3$ matrix of $T_q$ is
  $
    Q(q) = mat(
      1-2y^2-2z^2, 2x y-2z w, 2x z+2y w;
      2x y+2z w, 1-2x^2-2z^2, 2y z-2x w;
      2x z-2y w, 2y z+2x w, 1-2x^2-2y^2
    ).
  $
  Thus we obtain a homomorphism
  $ Psi : S^3 -> S O(3), quad q |-> Q(q). $
]

#prob[
  (a) Show that the kernel of $Psi$ is $\{plus.minus 1\}$.
  
  (b) Show that $Psi$ is surjective onto $S O(3)$. (Hint: any rotation in $bb(R)^3$ is rotation about some axis by some angle; construct a corresponding quaternion.)
  
  (c) Conclude that
  $ S^3 \/ \{plus.minus 1\} tilde.equiv S O(3). $
]

#prob[
  Using Problem 2, translate the above result into the language of matrices: prove that
  $ S U(2) \/ \{plus.minus I\} tilde.equiv S O(3). $
]

#v(1em)

*Final Conclusion.* We have shown that the group $S U(2)$ is isomorphic to $S^3$, and the action of $S^3$ on $bb(R)^3$ by conjugation gives a surjective homomorphism onto $S O(3)$ with kernel $\{plus.minus 1\}$. Therefore,
$ S U(2) \/ \{plus.minus I\} tilde.equiv S O(3). $