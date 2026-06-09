package com.cinebook.dto;

import com.cinebook.entity.Role;

public class AuthResponse {

    private Long id;
    private String username;
    private Role role;
    private Long theaterId;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String username, Role role, Long theaterId) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.theaterId = theaterId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getTheaterId() { return theaterId; }
    public void setTheaterId(Long theaterId) { this.theaterId = theaterId; }
}
