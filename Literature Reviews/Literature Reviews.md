#Network Monitoring Paper Review (First draft for Brett on Monday)
- URL: http://www.ijiee.org/papers/280-N011.pdf
- Title: An Efficient Network Monitoring and Management System
- Authors: Rafiullah Khan, Sarmad Ullah Khan, Rifaqat Zaheer, and Muhammad Inayatullah Babar 
- Notes: This describes using Nagios in detail, which could be INCREDIBLY useful later because it turns out Nagios has a JSON API. My chat bot + Nagios API could be an awesome way of getting incredibly detailed information to the end user (admin). Worth exploring.

##Review

According to Khan et al. 2013, large organizations require fast and efficient network monitoring systems which reports to a network administrator via email or SMS as soon as a problem arises, with details of the problem and locations affected. They go on to explain the merits of Nagios(A network monitoring tool) and its role in their system. It is extremely important, they mention, that the system be essentially autonomous in operation, as in a large company manual monitoring is very difficult.

The paper contains some basic instruction for configuring a Nagios setup and defines several ways for the software to check the status of various servers and services, and could act as a good guide for somebody new to Nagios configuration. However, the paper does not explore additional ways of informing administrators of issues, nor does it compare other software that may have similar features. 

###Citation
Rafiullah Khan, Sarmad Ullah Khan, Rifaqat Zaheer, and M. I. B. (2013) ‘An Efficient Network Monitoring and Management System’, International Journal of Information and Electronics Engineering, 3(1), p. 122. doi: 10.7763/IJIEE.2013.V3.280.

#Something Else