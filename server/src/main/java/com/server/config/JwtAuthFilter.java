//package com.server.config;
//
//import com.server.repository.RevokedTokenRepository;
//import io.jsonwebtoken.Claims;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.http.HttpHeaders;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.List;
//
//@Component
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//    private final JwtService jwtService;
//    private final RevokedTokenRepository revokedTokenRepository;
//
//    public JwtAuthFilter(JwtService jwtService, RevokedTokenRepository revokedTokenRepository) {
//        this.jwtService = jwtService;
//        this.revokedTokenRepository = revokedTokenRepository;
//    }
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        String path = request.getServletPath();
//
//        return path.equals("/")
//                || path.equals("/health")
//                || path.startsWith("/auth/")               // register/login
//                || path.startsWith("/swagger-ui")          // swagger UI
//                || path.equals("/swagger-ui.html")
//                || path.startsWith("/v3/api-docs")         // openapi json
//                || path.startsWith("/swagger-resources")   // (older tooling)
//                || path.startsWith("/webjars");            // swagger static assets
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException {
//
//        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
//
//        // If no token, continue (SecurityConfig decides if endpoint is public or not)
//        if (header == null || !header.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        String token = header.substring(7).trim();
//
//        // Enforce logout: reject blacklisted tokens
//        if (revokedTokenRepository.existsByToken(token)) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Token revoked. Please login again.");
//            return;
//        }
//
//        // Validate signature/expiration
//        if (!jwtService.isValid(token)) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Invalid token.");
//            return;
//        }
//
//        // Build Authentication from claims
//        Claims claims = jwtService.parseClaims(token);
//        String username = claims.getSubject();
//        Boolean admin = claims.get("admin", Boolean.class);
//
//        var authorities = (Boolean.TRUE.equals(admin))
//                ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
//                : List.of(new SimpleGrantedAuthority("ROLE_USER"));
//
//        var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
//        SecurityContextHolder.getContext().setAuthentication(auth);
//
//        filterChain.doFilter(request, response);
//    }
//}
