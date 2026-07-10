package com.example.ai.Security;

import com.example.ai.Entity.User;
import com.example.ai.Repo.UserRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private static final String TOKEN_COOKIE = "token";

    private final JwtUtils jwtUtils;
    private final UserRepo userRepo;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = extractToken(request);
            if (token == null) {
                filterChain.doFilter(request, response);
                return;
            }


            if (!jwtUtils.validateToken(token)) {
                clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            String rollno = jwtUtils.extractRollNo(token);
            if (rollno == null || rollno.isBlank()) {
                clearContext();
                filterChain.doFilter(request, response);
                return;
            }


            Optional<User> userOpt = userRepo.findByRollno(rollno);
            if (userOpt.isEmpty()) {
                clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            User user = userOpt.get();
            if (user.getRole() == null) {
                clearContext();
                filterChain.doFilter(request, response);
                return;
            }


            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(authority)
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);


            request.setAttribute("rollno", rollno);

        } catch (Exception ex) {

            clearContext();
        }

        filterChain.doFilter(request, response);
    }


    private String extractToken(HttpServletRequest request) {


        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (TOKEN_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }


        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        return null;
    }

    private void clearContext() {
        SecurityContextHolder.clearContext();
    }
}