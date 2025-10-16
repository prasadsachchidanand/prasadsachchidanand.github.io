#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Assignment #1"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "untill isometry"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  If $lambda in bb(H)$ commutes with every element of $HH$, prove that $lambda in RR$. 
]

#prob[
  Let $q in HH$, and define 
  $
    CC dot q = {lambda dot q: lambda in CC} subset HH " and " q dot CC = {q dot lambda : lambda in CC} subset HH.
  $

  (i) Let $g_1 : HH to CC^2 $, $(a + b dot bf(i) + c dot bf(j) + d dot bf(k) |-> (a + b dot bf(i), c + d dot bf(i))$. Show that $g_1(CC dot q)$ is a one-dimensional subspace $CC$-subspace of $CC^2$.  
  
  (ii) Define an indetification $tilde(g)_1 : HH to CC^2 $ such that $tilde(g)_1(q dot CC)$ is a one-dimensional $CC$-subspace of $CC^2$.  
]

#prob[
  Recall that for any subsegt $X subset RR^2$, the symmetry group 
  $
    "Symm"(X) := {f in "Isom"(X): f(X ) = X}.
  $ 
  (i) Consider $X subset RR^2$. Show that if $"Symm"(X)$ is a finite set, then its elements must share a common fixed point and hence isomorphic to a subgroup of $O(2)$.

  (ii) The only finite subgroups of $O(2)$ are $ZZ_m$ and $D_m$, where $D_m$ is the dihedral group.      
]

#prob[
  Think of $S p(1)$ as the group of unit-length quaternions; that is, 
  $
    S p(1) = {q in HH: abs(q) = 1}.
  $

  (i) For every $q in S p(1)$, show that the conjugation map $C_q: HH to HH$, defined as $C_q (bf(v))= q dot bf(v) dot overline(bf(v))$, is an orthogonal linear transformation. Thus, with respect to the natural basis ${1,bf(i), bf(j), bf(k)}$ of $HH$, $C_q$ can be regarded as an element of $O(4)$.

  (ii) For every $q in S p(1)$, verify that $C_q(1) = 1$ and therefore, that $C_q$ sends $"Im"(HH) = "span"(bf(i), bf(j), bf(k))$ to itself. Conclude that the restriction $C_q bar_("Im"(HH))$ can be regarded as an element of $O(3)$.

  (iii)Define $phi: S p(1) to O(3)$ as 
  $
    phi(q) = C_q bar_("Im"(HH)).
  $ 
  Verify that $phi$ is a group homomorphism. 

  (iv) Verify that the kernel of $phi$ is ${1, -1}$ and therefore, that $phi$ is two-to-one map.   

  (v) [#text(red)[Bonus Problem]] Show that the image of $phi$ is $S O(3)$.

  (vi) Also show that $S p(1)$ is homomorphic to $S U(2)$.   

  (vii) Finally can you identify something from here.
]

_From now onward a matrix group $G$ means a closed (topological closed) subgroup of $G L_n (FF)$. By closedness, we mean that if a sequence in $G$ has a limit in $G L_n (FF)$, then that limit must lie in $G$._

#prob[
     Let $G$ be a matrix group and $H subset G$ be closed subgroup of $G$. Prove that $H$ is a matrix group.   
]

#prob[
  Prove that $"Aff"_n (FF)$ is NOT closed in $M_(n+1)(FF)$ but it is a matrix group. Is it compact?
]

#prob[
  A matrix $A in M_n (FF)$ is called _upper triangular matrix_ if all entries below the diagonal are zero, that is, $a_(i j) = 0$ for $i > j$. Prove that 
  $
    U T_n (FF) = {A in M_n (FF): A "is an upper triangular matrix"}
  $    
  is not closed in $M_n (FF)$. 

  Note that if the diagonal elements are not zero, then $U T_n (RR)$ is a subset of $G L_n (RR)$. Is it a matrix group?   
]

#prob[
  Prove that $"Isom"(RR^n)$ is a matrix group. Is it compact?
]

#prob[
  Let$ G subset G L_n (RR)$ be a compact subgroup.

  (i) Prove that every element of $G$ has determinant $1$ or $-1$.

  (ii) Is it true that $G subset O(n)$?    
]

#prob[
  There are two natural functions from $S U(n) times U(1)$ to $U(n)$. The first is $f_1(A, lambda) = lambda dot A$. The second is $f_2(A, lambda) = $ the
  result of multiplying each entry of the first row of $A$ times $lambda$. 

  (i) Prove that $f_1$ is an $n$-to-$1$ homomorphism. 

  (ii) Prove that $f_2$ is a homeomorphism but not a homomorphism when $n >= 2$.       
]