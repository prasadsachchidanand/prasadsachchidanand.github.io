#import "template.typ": *
#let title = "Homework #8"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "fundamental group"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Recall that for any based topoligcal space $(X, x_0)$, $pi_1(X, x_0)$ is the collection of homotopy classes of loops in $X$ based at $x_0$. We have seen that with the usual concatenation, it forms a group. In this exercise, we will learn that the parameter of the concatenation does not change the result. 

  Let $alpha, beta : [0,1] to X$ be two loops based at $x_0$. Define 
  $
    (alpha star beta)(s) = cases(
      alpha(3s)\, quad & 0<= s <= 1/3, 
      beta((3s-1)/2)\, quad & 1/3 <= s <= 1.
    )
  $  
  For any $[alpha], [beta] in pi_1(X, x_0)$, define 
  $
    [alpha] star [beta] := [alpha star beta].
  $   
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Show that $alpha star beta$ is a loop based at $x_0$. Show that $star$ is well defined. 
    ],
    [
      Show that the operation $star$ induces a well-defined operation on homotopy classes of loops.
    ],
    [
      Let $*$ denote the usual concatenation 
      $
        (alpha * beta)(s) = cases(
          alpha(2s)\, quad & 0 <= s <= 1/2 ,
          beta(2s - 1)\, quad & 1/2 <= s <= 1.
        )
      $ 
      Show that $alpha * beta tilde.eq alpha star beta$. 
    ],
    [
      Deduce that the operation $star$ defines the same group structure on $pi_1(X, x_0)$ as the usual concatenation.  
    ]
  )
  #v(1cm)
  *Generalization:* For $0 < a < 1$, define 
  $
    (alpha *_a beta)(s) : = cases(
      alpha(s/a)\, quad & 0 <=s <= a,
      beta((s-a)/(1-a))\, quad & a <= t <=1
    )
  $ 
  Show that for every $a in (0,1)$, the induced group structure on $pi_1(X, x_0)$ is the same.   
]

#prob[
  Consider the assignment
  $
    pi_1: bf("Top"_*) to bf("Groups")
  $
  #enum(
    indent: 1em,
    numbering: "a)",
    [
      $(X, x_0) mapsto pi_1(X, x_0)$, and 
    ],
    [
      for any morphism $f: (X,x_0) to (Y, y_0)$, continuous, 
      $
        pi_1(f): pi_1(X, x_0) to pi_1(Y, y_0), quad [alpha] mapsto [f compose alpha].
      $ 
    ]
  )
  Chech that $pi_1$ is a functor. That is, you need to check: 
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      If $[alpha] = [beta]$, then $[f compose alpha] = [f compose beta]$.  
    ],
    [
      It is a homomorphism. That is, 
      $
        pi_1(f)([alpha] * [beta]) = pi_1(f)([alpha]) * pi_1(f)([beta]), \
        f compose (alpha * beta) = (f compose alpha) * (f compose beta).
      $ 
    ],
    [
      For identity map 
      $
        pi_1("id"_X) = "Id"_(pi_1(X)).
      $
    ],
    [
      If $X ->^(f) Y to^g Z$, then $pi_1(g compose f) = pi_1(f) compose pi_1(g)$. 
    ],
    [
      If $f: (X, x_0) to (Y, y_0)$ is an isomorphism (that is, a homeomorphism in this category), then $f_*: pi_1(X, x_0) to pi_1(Y, y_0)$ is an isomorphism (that is, a group isomorphism in this category).  
    ]
  )
  *Note:* Usually $pi_1(f)$ is denoted by $f_*$ and is called as #focus[homomorphism induced by $f$].   
]

#prob[
   Let $x_0 "and" x_1$ be points of a path-connected space $X$. Show that $pi_1(X, x_0)$ is abelian if and only if for every pair $alpha$ and $beta$ of paths from $x_0$ to $x_1$, we have $hat(alpha) = hat(beta)$, where 
   $
    hat(alpha) : pi_1(X, x_0) to pi_1(X, x_1), quad [gamma] mapsto [overline(alpha)] * [f] * [alpha].
   $        
]

#prob[
  Let $G$ be a topological group with operation $dot$ and identity element $x_0$. Let $Omega(G, x_0)$ denote the set of all loops in $G$ based at $x_0$. For $f,g in Omega(G, x_0)$,  define 
  $
    (f times.o g)(s) :=  f(s) dot g(s).
  $
  #enum(
    indent: 1em,
    numbering: "i)",
    [
      Show that this operation makes the set $Omega(G, x_0)$ into a group.  
    ],
    [
      Show that this operation induces a group operation $times.o$ on $pi_1(G, x_0)$.  
    ],
    [
      Show that the two group operations $*$ and $times.o$ on $pi_1(G, x_0)$ re the same. 

      *Hint:* Compute $(f* e_(x_0)) times.o (e_(x_0) * g)$.    
    ],
    [
      Show that $pi_1(G, x_0)$ is abelain.  
    ]
  )
]