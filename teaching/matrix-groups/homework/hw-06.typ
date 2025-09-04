#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #6"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "topology of matrix groups"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#let ip(x, y) = $lr(angle.l #x, #y angle.r)$
#let bf(x) = $bold(#x)$

#prob[
  Let $(M,d) "and" (N, rho)$ be two metric space and $f: M -> N$ be a conitnuous function. Prove or disprove the statements. If the statement is true, then prove it and if false, provide a counterexample.
  
  
  + If $U$ is an open (closed) set in $M$, then $f(U)$ is open (closed) in $N$.
  
  + If $K$ is boundedn in $M$, then $f(K)$ is also bounded in $N$.
  
  + If $K$ is compact in $M$, then $f(K)$ is also compact in $N$.
  
  + If $K$ is bounded (compact) in $N$, then $f^(-1)(K)$ is bounded (compact) in $M$.
]

#prob[
  Let
  $
    M_r = {A in M_n (RR): det A = r} "and" T_r = {A in M_n (RR) : tr(A) = r},
  $
  where $tr A$ denotes the trace of $A$.
  
  + Are $M_r$, $T_r$ open? Are they closed?
  
  + Are $M_r$, $T_r$ bounded?
  
  + Are $M_r$, $T_r$ compact?
]

#prob[
  Let $M_n (RR)$ is equipped with the Euclidean metric. Then prove that the following maps are conitnuous.
  
  + $det : M_n (RR) -> M_n (RR), quad A |-> det A$.
  
  + $tr : M_n (RR) -> M_n (RR), quad A |-> tr A$.
  + $tau : M_n (RR) -> M_n (RR), quad A |-> A^T$.
  + $mu : M_n (RR) times M_n (RR) -> M_n (RR), quad (A, B) |-> A dot B$.
  + $iota : G L_n (RR) -> G L_n (RR), quad A |-> A^(-1)$.
]

#prob[
  We define the *_inner product_* on $FF^n$, where $FF = RR "or" CC$, as follows. Let $bold(z) = (z_1, dots, z_n)$ and $bold(w) = (w_1, dots, w_n)$. Then
  
  $
    ip(z, w) := sum_(j=1)^n z_j macron(w)_j.
  $
  
  The *_norm_* on $FF^n$ is defined as $norm(bf(z)) := sqrt(ip(bf(z), bf(z)))$. We define the following:
  
  - Vectors $bf(x) "and" bf(y)$ are called *_orthogonal_* if $ip(bf(x), bf(y)) = 0$.
  
  - The vectors $bf(x) "and" bf(y)$ are called *_orthonormal_* if they are orthogonal and $norm(bf(x)) = 1 = norm(bf(y))$.
  
  - A basis $cal(B) = {bf(v)_1, dots, bf(v)_n}$ of a vector space $V$ is called an *_orthonormal basis_* if $ip(bf(v)_i, bf(v)_j) = delta_(i j)$, where $delta_(i j) = 0$ if $i!=j$ and $1$ if $i = j$.
  
  Now prove the following are equivalent.
  
  (i) A matrix $A in O_n (RR)$, that is, $A A^T = I = A^T A$.
  
  (ii) $ip(A bf(x), A bf(y)) = ip(bf(x), bf(y))$ for any $bf(x), bf(y) in RR^n$.
  
  (ii) The rows of $A$ form an orthonormal basis of $RR^n$.
]