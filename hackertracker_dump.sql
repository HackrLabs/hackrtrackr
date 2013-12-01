--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: cardtype; Type: TYPE; Schema: public; Owner: hackertracker
--

CREATE TYPE cardtype AS ENUM (
    'nfc',
    'rfid'
);


ALTER TYPE public.cardtype OWNER TO hackertracker;

--
-- Name: memberlevel; Type: TYPE; Schema: public; Owner: hackertracker
--

CREATE TYPE memberlevel AS ENUM (
    'subsidized',
    'maker',
    'sponser',
    'booster',
    'Student'
);


ALTER TYPE public.memberlevel OWNER TO hackertracker;

--
-- Name: memberrole; Type: TYPE; Schema: public; Owner: hackertracker
--

CREATE TYPE memberrole AS ENUM (
    'non-member',
    'member',
    'board',
    'founder'
);


ALTER TYPE public.memberrole OWNER TO hackertracker;

--
-- Name: memberstatus; Type: TYPE; Schema: public; Owner: hackertracker
--

CREATE TYPE memberstatus AS ENUM (
    'Banned',
    'Canceled',
    'Moved',
    'Pending Payment',
    'Good Standing',
    'Provisional'
);


ALTER TYPE public.memberstatus OWNER TO hackertracker;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: areas; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE areas (
    id integer NOT NULL,
    name character varying(255),
    "desc" text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    photo_file_name character varying(255),
    photo_content_type character varying(255),
    photo_file_size integer,
    photo_updated_at timestamp without time zone,
    sequence integer
);


ALTER TABLE public.areas OWNER TO hackertracker;

--
-- Name: areas_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE areas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.areas_id_seq OWNER TO hackertracker;

--
-- Name: areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE areas_id_seq OWNED BY areas.id;


--
-- Name: cards; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE cards (
    memberid integer,
    cardtype cardtype,
    cardid character varying(20)
);


ALTER TABLE public.cards OWNER TO hackertracker;

--
-- Name: caveats; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE caveats (
    id integer NOT NULL,
    item_id integer,
    user_id integer,
    body text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.caveats OWNER TO hackertracker;

--
-- Name: caveats_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE caveats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caveats_id_seq OWNER TO hackertracker;

--
-- Name: caveats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE caveats_id_seq OWNED BY caveats.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE contacts (
    id integer NOT NULL,
    fuid integer,
    phone character varying(255),
    email character varying(255),
    name character varying(255),
    handle character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.contacts OWNER TO hackertracker;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO hackertracker;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE contacts_id_seq OWNED BY contacts.id;


--
-- Name: emergencycontacts; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE emergencycontacts (
    memberid integer,
    contactname character varying(200),
    contactphone character varying(15),
    priority integer
);


ALTER TABLE public.emergencycontacts OWNER TO hackertracker;

--
-- Name: items; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE items (
    id integer NOT NULL,
    loggable boolean,
    ticketable boolean,
    name character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    photo_file_name character varying(255),
    photo_content_type character varying(255),
    photo_file_size integer,
    photo_updated_at timestamp without time zone,
    fuid integer,
    area_id integer
);


ALTER TABLE public.items OWNER TO hackertracker;

--
-- Name: labaccess; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE labaccess (
    memberid integer,
    logintime timestamp without time zone DEFAULT now(),
    description text
);


ALTER TABLE public.labaccess OWNER TO hackertracker;

--
-- Name: logs; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE logs (
    id integer NOT NULL,
    fuid integer,
    user_id integer,
    body text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.logs OWNER TO hackertracker;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logs_id_seq OWNER TO hackertracker;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE logs_id_seq OWNED BY logs.id;


--
-- Name: memberallergies; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE memberallergies (
    memberid integer,
    description text
);


ALTER TABLE public.memberallergies OWNER TO hackertracker;

--
-- Name: members; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE members (
    memberid bigint NOT NULL,
    firstname character varying(50),
    lastname character varying(50),
    emailaddress character varying(255),
    mailingaddress text,
    handle character varying(100),
    phonenumber character varying(15),
    joindate date,
    dob date,
    memberlevel memberlevel DEFAULT 'maker'::memberlevel,
    memberstatus memberstatus DEFAULT 'Pending Payment'::memberstatus,
    wavier boolean DEFAULT true,
    role memberrole,
    adminlvl integer DEFAULT 0,
    paperfilloutdate date,
    isactive boolean DEFAULT true
);


ALTER TABLE public.members OWNER TO hackertracker;

--
-- Name: members_memberid_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE members_memberid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.members_memberid_seq OWNER TO hackertracker;

--
-- Name: members_memberid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE members_memberid_seq OWNED BY members.memberid;


--
-- Name: membersigs; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE membersigs (
    memberid integer,
    signerid bigint NOT NULL,
    signdate timestamp without time zone
);


ALTER TABLE public.membersigs OWNER TO hackertracker;

--
-- Name: membersigs_signerid_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE membersigs_signerid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.membersigs_signerid_seq OWNER TO hackertracker;

--
-- Name: membersigs_signerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE membersigs_signerid_seq OWNED BY membersigs.signerid;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE payments (
    id integer NOT NULL,
    user_id integer,
    transaction_type character varying(255),
    email character varying(255),
    transactionid character varying(255),
    transaction_time timestamp without time zone,
    status character varying(255),
    amount numeric,
    currencycode character varying(255),
    feeamt numeric,
    netamt numeric,
    name character varying(255),
    dues boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO hackertracker;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO hackertracker;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE payments_id_seq OWNED BY payments.id;


--
-- Name: photos; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE photos (
    id integer NOT NULL,
    fuid integer,
    user_id integer,
    photo_file_name character varying(255),
    photo_content_type character varying(255),
    photo_file_size integer,
    photo_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.photos OWNER TO hackertracker;

--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.photos_id_seq OWNER TO hackertracker;

--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE photos_id_seq OWNED BY photos.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE settings (
    id integer NOT NULL,
    paypal_user character varying(255),
    paypal_pass character varying(255),
    paypal_signature character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.settings OWNER TO hackertracker;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO hackertracker;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE settings_id_seq OWNED BY settings.id;


--
-- Name: suggestions; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE suggestions (
    id integer NOT NULL,
    body text,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.suggestions OWNER TO hackertracker;

--
-- Name: suggestions_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE suggestions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suggestions_id_seq OWNER TO hackertracker;

--
-- Name: suggestions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE suggestions_id_seq OWNED BY suggestions.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE tickets (
    id integer NOT NULL,
    item_id integer,
    user_id integer,
    status boolean,
    body text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ticket_type character varying(255)
);


ALTER TABLE public.tickets OWNER TO hackertracker;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tickets_id_seq OWNER TO hackertracker;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE tickets_id_seq OWNED BY tickets.id;


--
-- Name: tutorials; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE tutorials (
    id integer NOT NULL,
    fuid integer,
    user_id integer,
    body text,
    url text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tutorials OWNER TO hackertracker;

--
-- Name: tutorials_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE tutorials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tutorials_id_seq OWNER TO hackertracker;

--
-- Name: tutorials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE tutorials_id_seq OWNED BY tutorials.id;


--
-- Name: unique_items_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE unique_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unique_items_id_seq OWNER TO hackertracker;

--
-- Name: unique_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE unique_items_id_seq OWNED BY items.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying(255) DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying(255) DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying(255),
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying(255),
    last_sign_in_ip character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(255),
    handle character varying(255),
    release_authorization character varying(255),
    paypal_email character varying(255),
    keycard_number character varying(255),
    birthday date,
    phone_number character varying(255),
    mailing_address character varying(255),
    sponsor_1_name character varying(255),
    sponsor_2_name character varying(255),
    level character varying(255),
    date_of_form date,
    date_joined date,
    ec_name character varying(255),
    ec_relation character varying(255),
    ec_home character varying(255),
    ec_cell character varying(255),
    ec_second_name character varying(255),
    ec_second_relation character varying(255),
    ec_second_home character varying(255),
    ec_second_cell character varying(255),
    ec_allergies character varying(255),
    role character varying(255)
);


ALTER TABLE public.users OWNER TO hackertracker;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: hackertracker
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO hackertracker;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hackertracker
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY areas ALTER COLUMN id SET DEFAULT nextval('areas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY caveats ALTER COLUMN id SET DEFAULT nextval('caveats_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY contacts ALTER COLUMN id SET DEFAULT nextval('contacts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY items ALTER COLUMN id SET DEFAULT nextval('unique_items_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY logs ALTER COLUMN id SET DEFAULT nextval('logs_id_seq'::regclass);


--
-- Name: memberid; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY members ALTER COLUMN memberid SET DEFAULT nextval('members_memberid_seq'::regclass);


--
-- Name: signerid; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY membersigs ALTER COLUMN signerid SET DEFAULT nextval('membersigs_signerid_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY payments ALTER COLUMN id SET DEFAULT nextval('payments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY photos ALTER COLUMN id SET DEFAULT nextval('photos_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY settings ALTER COLUMN id SET DEFAULT nextval('settings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY suggestions ALTER COLUMN id SET DEFAULT nextval('suggestions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY tickets ALTER COLUMN id SET DEFAULT nextval('tickets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY tutorials ALTER COLUMN id SET DEFAULT nextval('tutorials_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: hackertracker
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: areas_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- Name: caveats_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY caveats
    ADD CONSTRAINT caveats_pkey PRIMARY KEY (id);


--
-- Name: contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: logs_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: members_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY members
    ADD CONSTRAINT members_pkey PRIMARY KEY (memberid);


--
-- Name: payments_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: photos_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: settings_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY suggestions
    ADD CONSTRAINT suggestions_pkey PRIMARY KEY (id);


--
-- Name: tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY tutorials
    ADD CONSTRAINT tutorials_pkey PRIMARY KEY (id);


--
-- Name: unique_items_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY items
    ADD CONSTRAINT unique_items_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: hackertracker; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_unique_items_on_fuid; Type: INDEX; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE INDEX index_unique_items_on_fuid ON items USING btree (fuid);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: hackertracker; Tablespace: 
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON users USING btree (reset_password_token);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

