--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Ubuntu 14.9-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.9 (Ubuntu 14.9-0ubuntu0.22.04.1)

-- Started on 2023-11-24 20:56:33 EET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 17786)
-- Name: Sessions; Type: TABLE; Schema: public; Owner: dmytror
--

CREATE TABLE public."Sessions" (
    id integer NOT NULL,
    session_id text NOT NULL,
    user_id integer NOT NULL,
    "expirationDate" date NOT NULL,
    "createdAt" date,
    "updatedAt" date
);


ALTER TABLE public."Sessions" OWNER TO dmytror;

--
-- TOC entry 213 (class 1259 OID 17785)
-- Name: Session_id_seq; Type: SEQUENCE; Schema: public; Owner: dmytror
--

CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Session_id_seq" OWNER TO dmytror;

--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 213
-- Name: Session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dmytror
--

ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Sessions".id;


--
-- TOC entry 210 (class 1259 OID 17763)
-- Name: users; Type: TABLE; Schema: public; Owner: dmytror
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(300) NOT NULL,
    passhash character varying(300) NOT NULL
);


ALTER TABLE public.users OWNER TO dmytror;

--
-- TOC entry 209 (class 1259 OID 17762)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dmytror
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO dmytror;

--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dmytror
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 212 (class 1259 OID 17774)
-- Name: users_info; Type: TABLE; Schema: public; Owner: dmytror
--

CREATE TABLE public.users_info (
    id integer NOT NULL,
    user_id integer NOT NULL,
    pib character varying(200) NOT NULL,
    id_card character varying(100) NOT NULL,
    birthday character varying(50) NOT NULL,
    email character varying(300) NOT NULL,
    admin boolean NOT NULL,
    "group" character varying(20) NOT NULL
);


ALTER TABLE public.users_info OWNER TO dmytror;

--
-- TOC entry 211 (class 1259 OID 17773)
-- Name: users_info_id_seq; Type: SEQUENCE; Schema: public; Owner: dmytror
--

CREATE SEQUENCE public.users_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_info_id_seq OWNER TO dmytror;

--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dmytror
--

ALTER SEQUENCE public.users_info_id_seq OWNED BY public.users_info.id;


--
-- TOC entry 3343 (class 2604 OID 17789)
-- Name: Sessions id; Type: DEFAULT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public."Sessions" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);


--
-- TOC entry 3341 (class 2604 OID 17766)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 17777)
-- Name: users_info id; Type: DEFAULT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public.users_info ALTER COLUMN id SET DEFAULT nextval('public.users_info_id_seq'::regclass);


--
-- TOC entry 3351 (class 2606 OID 17793)
-- Name: Sessions Session_pkey; Type: CONSTRAINT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 3345 (class 2606 OID 17772)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3349 (class 2606 OID 17779)
-- Name: users_info users_info_pkey; Type: CONSTRAINT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_pkey PRIMARY KEY (id);


--
-- TOC entry 3347 (class 2606 OID 17770)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 17794)
-- Name: Sessions Session_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3352 (class 2606 OID 17780)
-- Name: users_info users_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dmytror
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2023-11-24 20:56:33 EET

--
-- PostgreSQL database dump complete
--

