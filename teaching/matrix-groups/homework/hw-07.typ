#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #7"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "orthogonal groups"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#let ip(x, y) = $lr(angle.l #x, #y angle.r)$
#let bf(x) = $bold(#x)$

#prob[
  Let $f = f_n : CC^n -> RR^(2n)$ be defined as 
  $
    f(a_1 + iota b_1, dots, a_n + iota b_n) = (a_1, b_1, dots, a_n, b_n).
  $ 
  (i) Show that for any $bf(v), bf(w) in CC$,
  $
    ip(bf(v), bf(w))_(CC) = ip(f(bf(v)), f(bf(w)))_(RR) + iota ip(f(bf(v)), f(iota bf(w)))_(RR). 
  $ 

  (ii) Show that ${bf(v)_1, bf(v)_2, dots, bf(v)_n} subset CC$ is an orthogonal basis if and only if ${f(bf(v_1)), f(iota bf(v)_1), dots, f(bf(v)_n), f(iota bf(v)_n)}$ is an orthonormal basis of $RR^(2n)$.   
]

#prob[
  In this problem we will prove the_ Cauchy-Schwarz inequality_.  For any $bf(v), bf(w) in FF^n$, 
  $
    abs(ip(bf(v), bf(w))) <= norm(bf(v)) dot norm(bf(w)).
  $
  Let $bf(v), bf(w) in FF^n$. Let us denote $ip(bf(v), bf(w)) =: alpha$.   

  (i) Show that for any $lambda in FF$, 
  $
    norm(lambda bf(v) + bf(w))^2 = abs(lambda)^2 norm(bf(v))^2 + 2 "Re"(lambda alpha) + norm(bf(w))^2. 
  $ 

  (ii) Choose $lambda = -macron(alpha)/norm(bf(v))^2$ to conclude 
  $
    abs(alpha) <= norm(bf(v)) dot norm(bf(w)). 
  $

  (iii) Deduce when does the equality hold in the above inequality.
]

#prob[
  
]